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

    var main = {

    };

    // For AMD
    if (typeof define === 'function' && define.amd) {
        define('san-router', [], main);
    }
    else {
        root.sanRouter = main;
    }


})(this);
