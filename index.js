/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 */

(function (root) {

    /**
     * 元素选择器
     *
     * @param {string|Element} selector 选择器
     * @returns {Element}
     */
    function elementSelector(selector) {
        switch (typeof selector) {
            case 'object':
                return selector;

            case 'string':
                if (document.querySelector) {
                    return document.querySelector(selector);
                }

                return document.getElementById(selector.replace(/#/i, ''));
        }
    }

    /**
     * 解析URL，返回包含path、query、queryString的对象
     *
     * @param {string} url 要解析的url
     * @return {Object}
     */
    function parseURL(url) {
        var result = {
            hash: '',
            queryString: '',
            params: {},
            query: {},
            path: url
        };

        // parse hash
        var hashStart = result.path.indexOf('#');
        if (hashStart >= 0) {
            result.hash = result.path.slice(hashStart + 1);
            result.path = result.path.slice(0, hashStart);
        }

        // parse query
        var query = result.query;
        var queryStart = result.path.indexOf('?');
        if (queryStart >= 0) {
            result.queryString = result.path.slice(queryStart + 1);
            result.path = result.path.slice(0, queryStart);

            result.queryString.split('&').forEach(querySeg => {
                // 考虑到有可能因为未处理转义问题，
                // 导致value中存在**=**字符，因此不使用`split`函数
                var equalIndex = querySeg.indexOf('=');
                var value = '';
                if (equalIndex > 0) {
                    value = querySeg.slice(equalIndex + 1);
                    querySeg = querySeg.slice(0, equalIndex);
                }

                var key = decodeURIComponent(querySeg);
                value = decodeURIComponent(value);

                // 已经存在这个参数，且新的值不为空时，把原来的值变成数组
                if (query.hasOwnProperty(key)) {
                    /* eslint-disable */
                    query[key] = [].concat(query[key], value);
                    /* eslint-disable */
                }
                else {
                    query[key] = value;
                }
            });

        }

        return result;
    }

    /**
     * 将 URL 中相对路径部分展开
     *
     * @param {string} source 要展开的url
     * @param {string} base 当前所属环境的url
     * @return {string}
     */
    function resolveURL(source, base) {
        var sourceLoc = parseURL(source);
        var baseLoc = parseURL(base);

        var sourcePath = sourceLoc.path;
        if (sourcePath.indexOf('/') === 0) {
            return source;
        }

        var sourceSegs = sourcePath.split('/');
        var baseSegs = baseLoc.path.split('/');
        baseSegs.pop();

        for (var i = 0; i < sourceSegs.length; i++) {
            var seg = sourceSegs[i];
            switch (seg) {
                case '..':
                    baseSegs.pop();
                    break;
                case '.':
                    break;
                default:
                    baseSegs.push(seg);
            }
        }

        if (baseSegs[0] !== '') {
            baseSegs.unshift('');
        }

        return baseSegs.join('/')
            + (sourceLoc.queryString ? '?' + sourceLoc.queryString : '');
    }

    function EventTarget() {
    }

    /**
     * 注册一个事件处理函数
     *
     * @param {string} type 事件的类型
     * @param {Function | boolean} fn 事件的处理函数
     */
    EventTarget.prototype.on = function (type, fn) {
        if (typeof fn !== 'function') {
            return;
        }

        if (!this._eventListeners) {
            this._eventListeners = {};
        }

        if (!this._eventListeners[type]) {
            this._eventListeners[type] = [];
        }

        this._eventListeners[type].push(fn);
    };


    /**
     * 注销一个事件处理函数
     *
     * @param {string} type 事件的类型，如果值为`*`仅会注销通过`*`为类型注册的事件，并不会将所有事件注销
     * @param {Function} [fn] 事件的处理函数，无此参数则注销`type`指定类型的所有事件处理函数
     */
    EventTarget.prototype.un = function (type, fn) {
        if (!this._eventListeners || !this._eventListeners[type]) {
            return;
        }

        if (!fn) {
            this._eventListeners[type] = [];
        }
        else {
            var listeners = this._eventListeners[type];
            var len = listeners.length;

            while (len--) {
                if (listeners[len] === fn) {
                    listeners.splice(len, 1);
                }
            }
        }
    };

    /**
     * 触发指定类型的事件
     *
     * @param {string} type 事件类型
     * @param {*} [args] 事件对象
     */
    EventTarget.prototype.fire = function (type, args) {
        if (!type) {
            throw new Error('No event type specified');
        }

        var listeners = this._eventListeners && this._eventListeners[type];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](args);
            }
        }
    };

    /**
     * 获取hash当前URL
     *
     * @return {string}
     */
    function getHashLocation() {
        // Firefox下`location.hash`存在自动解码的情况，
        // 比如hash的值是**abc%3def**，
        // 在Firefox下获取会成为**abc=def**
        // 为了避免这一情况，需要从`location.href`中分解
        var index = location.href.indexOf('#');
        var url = index < 0 ? '/' : (location.href.slice(index + 1) || '/');

        return url;
    }

    /**
     * hash 模式地址监听器
     *
     * @class
     */
    function HashLocator() {
        this.current = getHashLocation();
        this.referrer = '';

        var me = this;
        this.hashChangeHandler = function () {
            me.redirect(getHashLocation());
        };
    }

    HashLocator.prototype = new EventTarget();
    HashLocator.prototype.constructor = HashLocator;

    /**
     * 开始监听 url 变化
     */
    HashLocator.prototype.start = function () {
        if (window.addEventListener) {
            window.addEventListener('hashchange', this.hashChangeHandler, false);
        }

        if (window.attachEvent) {
            window.attachEvent('onhashchange', this.hashChangeHandler);
        }
    };

    /**
     * 停止监听
     */
    HashLocator.prototype.stop = function () {
        if (window.removeEventListener) {
            window.removeEventListener('hashchange', this.hashChangeHandler, false);
        }

        if (window.detachEvent) {
            window.detachEvent('onhashchange', this.hashChangeHandler);
        }
    };

    /**
     * 重定向
     *
     * @param {string} url 重定向的地址
     * @param {Object?} options 重定向的行为配置
     * @param {boolean?} options.force 是否强制刷新
     */
    HashLocator.prototype.redirect = function (url, options) {
        options = options || {};

        url = resoveURL(url, this.current);
        var referrer = this.current;

        var isChanged = url !== referrer;
        if (isChanged) {
            this.referrer = referrer;
            this.current = url;
            location.hash = url;
        }
        else {
            referrer = this.referrer;
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url, referrer});
        }
    };

    /**
     * 刷新当前 url
     */
    HashLocator.prototype.reload = function () {
        this.redirect(this.current, {force: true});
    };


    var routeID = 0x5942b;
    function guid() {
        return (++routeID).toString();
    }

    function isComponent(C) {
        return C.prototype && (C.prototype.nodeType === 5 || C.prototype._type === 'san-cmpt');
    }

    var main = {
        /**
         * 路由链接的 San 组件
         */
        Link: {
            template: '<a href="{{hrefPrefix}}{{href}}" onclick="return false;" on-click="clicker($event)" '
                + 'target="{{target}}" class="{{isActive ? activeClass : ''}}"><slot/></a>',

            clicker: function (e) {
                var href = this.data.get('href');

                if (typeof href === 'string') {
                    router.locator.redirect(href.replace(/^#/, ''));
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            },

            inited: function () {
                this.routeListener = e => {
                    this.data.set('isActive', e.url === this.data.get('href'));
                };

                this.routeListener({url: router.locator.current});
                router.listen(this.routeListener);
            },

            disposed: function () {
                router.unlisten(this.routeListener);
                this.routeListener = null;
            },

            initData: function () {
                return {
                    isActive: false,
                    hrefPrefix: router.mode === 'hash' ? '#' : ''
                };
            },

            computed: {
                href: function () {
                    var url = this.data.get('to') || '';
                    return resolveURL(url, router.locator.current);
                }
            }
        },

        version: '1.2.2'
    };

    // For AMD
    if (typeof define === 'function' && define.amd) {
        define('san-router', [], main);
    }
    else {
        root.sanRouter = main;
    }


})(this);
