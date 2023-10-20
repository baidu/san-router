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

            var querySegs = result.queryString.split('&');
            for (var i = 0; i < querySegs.length; i++) {
                var querySeg = querySegs[i];

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
            }

        }

        return result;
    }

    /**
     * 将解析后的URL对象，转换成字符串
     *
     * @param {Object} source 解析后的URL对象
     * @return {string}
     */
    function stringifyURL(source) {
        if (!source) {
            return '';
        }

        if (typeof source === 'string') {
            return source;
        }

        var query = source.query;
        var params = source.params;
        var isPathFillable;

        var path = source.path || '';
        var resultPath = [];
        if (path) {
            var pathSegs = path.split('/');

            for (var i = 0, l = pathSegs.length; i < l; i++) {
                var seg = pathSegs[i];
                if (/^:[a-z0-9_-]+$/.test(seg)) {
                    isPathFillable = true;
                    var name = seg.slice(1);
                    resultPath.push(params && params[name] || query && query[name]);
                }
                else {
                    resultPath.push(seg);
                }
            }
        }

        var queryString = source.queryString || '';
        if (queryString.indexOf('?') === 0) {
            queryString = queryString.slice(1);
        }

        if (!queryString && query && (!isPathFillable || params)) {
            var firstQuery = true;

            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    queryString += (firstQuery ? '' : '&')
                        + key + '=' + encodeURIComponent(query[key]);
                    firstQuery = false;
                }
            }
        }

        return resultPath.join('/') + (queryString && '?') + queryString;
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

        var path;
        if (!sourcePath) {
            path = baseLoc.path;
        }
        else {
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
            path = baseSegs.join('/');
        }



        return path + (sourceLoc.queryString ? '?' + sourceLoc.queryString : '');
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
     * 根据目标路径创建 hash href 路径
     *
     * @param {string} to 目标路径
     * @returns {string} href
     */
    function createHashHref(to) {
        var href = location.href;
        var hashIndex = href.indexOf('#');
        return href.slice(0, hashIndex + 1) + to;
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

        url = resolveURL(url, this.current);
        var referrer = this.current;

        var isChanged = url !== referrer;
        if (isChanged) {
            this.referrer = referrer;
            this.current = url;
            if (options.replace) {
                location.replace(createHashHref(url));
            } else {
                location.hash = url;
            }
        }
        else {
            referrer = this.referrer;
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url: url, referrer: referrer});
        }
    };


    /**
     * 刷新当前 url
     */
    HashLocator.prototype.reload = function () {
        this.redirect(this.current, {force: true});
    };

    /**
     * 获取当前URL
     *
     * @return {string}
     */
    function getLocation() {
        return location.pathname + location.search;
    }

    /**
     * html5 模式地址监听器
     *
     * @class
     */
    function HTML5Locator() {
        if (!HTML5Locator.isSupport) {
            throw new Error('[SAN-ROUTER ERROR] Your navigator doesn\'t supports HTML5!');
        }

        this.current = getLocation();
        this.referrer = '';

        var me = this;

        this.popstateHandler = function () {
            me.referrer = me.current;
            me.current = getLocation();

            me.fire('redirect', {
                url: me.current,
                referrer: me.referrer
            });
        };
    }

    HTML5Locator.prototype = new EventTarget();
    HTML5Locator.prototype.constructor = HTML5Locator;

    /**
     * 开始监听 url 变化
     */
    HTML5Locator.prototype.start = function () {
        window.addEventListener('popstate', this.popstateHandler);
    };

    /**
     * 停止监听
     */
    HTML5Locator.prototype.stop = function () {
        window.removeEventListener('popstate', this.popstateHandler);
    };

    /**
     * 重定向
     *
     * @param {string} url 重定向的地址
     * @param {Object?} options 重定向的行为配置
     * @param {boolean?} options.force 是否强制刷新
     */
    HTML5Locator.prototype.redirect = function (url, options) {
        options = options || {};

        url = resolveURL(url, this.current);
        var referrer = this.current;

        var isChanged = url !== referrer;

        if (isChanged) {
            this.referrer = referrer;
            this.current = url;

            history[options.replace ? 'replaceState' : 'pushState']({}, '', url);
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url: url, referrer: referrer});
        }
    };

    /**
     * 刷新当前 url
     */
    HTML5Locator.prototype.reload = function () {
        this.fire('redirect', {
            url: this.current,
            referrer: this.referrer
        });
    };

    HTML5Locator.isSupport = 'pushState' in window.history;


    var routeID = 0x5942b;
    function guid() {
        return (++routeID).toString();
    }

    function isComponent(C) {
        return C.prototype && (C.prototype.nodeType === 5 || C.prototype._type === 'san-cmpt');
    }


    /**
     * 路由器类
     *
     * @class
     * @param {Object?} options 初始化参数
     * @param {string?} options.mode 路由模式，hash | html5
     */
    function Router(options) {
        options = options || {};
        var mode = options.mode || 'hash';

        this.routes = [];
        this.routeAlives = [];
        this.listeners = [];

        this.__withRouteListeners = [];
        this.__redirectListener = routerGetRedirectListener(this);

        this.setMode(mode);
    }

    /**
     * 匹配 url
     *
     * @param {Object|string} url 要匹配的url
     * @return {Object} routeInfo
     */
    Router.prototype.match = function (url, referrer) {
        if (typeof url === 'string') {
            url = parseURL(url);
        }

        for (var i = 0; i < this.routes.length; i++) {
            var item = this.routes[i];
            var match = item.rule.exec(url.path);

            if (match) {
                // fill params
                var keys = item.keys || [];
                for (var j = 1; j < match.length; j++) {
                    var key = keys[j] || j;
                    var value = match[j];
                    url.query[key] = value;
                    url.params[key] = value;
                }

                return {
                    data: {
                        hash: url.hash,
                        queryString: url.queryString,
                        params: url.params,
                        query: url.query,
                        path: url.path,
                        referrer: referrer
                    },
                    url: url,
                    route: item
                };
            }
        }

        return null;
    }

    /**
     * 添加路由监听器
     *
     * @param {function(e, config)} listener 监听器
     */
    Router.prototype.listen = function (listener) {
        this.listeners.push(listener);
    };

    /**
     * 移除路由监听器
     *
     * @param {Function} listener 监听器
     */
    Router.prototype.unlisten = function (listener) {
        var len = this.listeners.length;
        while (len--) {
            if (this.listeners[len] === listener) {
                this.listeners.splice(len, 1);
            }
        }
    };

    /**
     * 启动路由功能
     *
     * @return {Object} san-router 实例
     */
    Router.prototype.start = function () {
        if (!this.isStarted) {
            this.isStarted = true;
            this.locator.on('redirect', this.__redirectListener);
            this.locator.start();
            this.locator.reload();
        }

        return this;
    };

    /**
     * 停止路由功能
     *
     * @return {Object} san-router 实例
     */
    Router.prototype.stop = function () {
        this.locator.un('redirect', this.__redirectListener);
        this.locator.stop();
        this.isStarted = false;

        return this;
    };

    /**
     * 设置路由模式
     *
     * @param {string} mode 路由模式，hash | html5
     * @return {Object} san-router 实例
     */
    Router.prototype.setMode = function (mode) {
        mode = mode.toLowerCase();
        if (this.mode === mode) {
            return;
        }

        this.mode = mode;

        var restart = false;
        if (this.isStarted) {
            this.stop();
            restart = true;
        }

        switch (mode) {
            case 'hash':
                this.locator = new HashLocator();
                break;
            case 'html5':
                this.locator = new HTML5Locator();
        }

        if (restart) {
            this.start();
        }

        return this;
    };

    /**
     * 添加路由项，支持单一数据或者数组配置
     *
     * @public
     * @param {Object|Array<Object>} config 路由项配置
     * @return {Object} san-router 实例
     */
     Router.prototype.add = function (config) {
        if (config instanceof Array) {
            for (var i = 0, l = config.length; i < l; i++) {
                routerAdd(this, config[i]);
            }
        }
        else if (typeof config === 'object') {
            routerAdd(this, config);
        }

        return this;
    };

    /**
     * 编程式路由函数，间接使用 redirect 重定向，避免直接使用内部对象locator
     *
     * @param {Object|string} url 路由地址
     * @param {Object?} options 重定向的行为配置
     * @param {boolean?} options.force 是否强制刷新
     */
    Router.prototype.push = function (url, options) {
        this.locator.redirect(stringifyURL(url), options);
    };

    /**
     * 替换路由 replace
     *
     * @param {Object|string} url 路由地址
     * @param {Object?} options 重定向的行为配置
     * @param {boolean?} options.force 是否强制刷新
     */
    Router.prototype.replace = function (url, options) {
        options = Object.assign({replace: true}, options);
        this.locator.redirect(stringifyURL(url), options);
    };

    /**
     * 添加路由项
     * 当规则匹配时，路由将优先将Component渲染到target中。如果没有包含Component，则执行handler函数
     *
     * @param {Object} config 路由项配置
     * @param {string|RegExp} config.rule 路由规则
     * @param {Function?} config.handler 路由函数
     * @param {Function?} config.Component 路由组件
     * @param {string} config.target 路由组件要渲染到的目标位置
     */
    function routerAdd(router, config) {
        var rule = config.rule;
        var keys = [''];

        if (typeof rule === 'string') {
            // 没用path-to-regexp，暂时不提供这么多功能支持
            var regText = rule.replace(
                /\/:([a-z0-9_-]+)(?=\/|$)/ig,
                function (match, key) {
                    keys.push(key);
                    return '/([^/\\s]+)';
                }
            );

            rule = new RegExp('^' + regText + '$', 'i');
        }

        if (!(rule instanceof RegExp)) {
            throw new Error('[SAN-ROUTER ERROR] Rule must be string or RegExp!');
        }

        var id = guid();
        router.routes.push({
            id: id,
            rule: rule,
            handler: config.handler,
            keys: keys,
            target: config.target || '#main',
            Component: config.Component,
            config: config
        });
    }

    /**
     * 获取 router 的 locator redirect 事件监听函数
     *
     * @param {Router} router router 实例
     * @return {Function}
     */
    function routerGetRedirectListener(router) {
        return function (e) {
            var url = parseURL(e.url);
            var routeInfo = router.match(url, e.referrer);
            var listenerSource = routeInfo ? routeInfo.data : url;

            var i = 0;
            var state = 1;

            /**
             * listener 事件对象
             *
             * @type {Object}
             */
            var listenerEvent = {
                url: e.url,
                hash: listenerSource.hash,
                queryString: listenerSource.queryString,
                query: listenerSource.query,
                params: listenerSource.params,
                path: listenerSource.path,
                referrer: e.referrer,
                config: routeInfo && routeInfo.route.config,
                data: routeInfo && routeInfo.data,
                resume: function () {
                    if (state === 0) {
                        state = 1;
                        doNext();
                    }
                },
                suspend: function () {
                    state = 0;
                },
                stop: function () {
                    state = -1;
                }
            };

            /**
             * 尝试运行下一个listener
             *
             * @inner
             */
            function doNext() {
                if (state > 0) {
                    if (i < router.listeners.length) {
                        var listener = router.listeners[i++];
                        listener.call(router, listenerEvent);
                    }
                    else {
                        routeAction();
                    }

                    if (state > 0) {
                        doNext();
                    }
                }
            }

            /**
             * 运行路由行为
             *
             * @inner
             */
            function routeAction() {
                state = -1;

                if (routeInfo) {
                    routerDoRoute(router, routeInfo);
                }
                else {
                    var len = router.routeAlives.length;
                    while (len--) {
                        router.routeAlives[len].component.dispose();
                        router.routeAlives.splice(len, 1);
                    }
                }
            }

            doNext();
        };
    }

    /**
     * 执行路由
     *
     * @param {Object} routeInfo 路由信息
     */
    function routerDoRoute(router, routeInfo) {
        var routeItem = routeInfo.route;
        var isUpdateAlive = false;
        var len = router.routeAlives.length;
        var withRouteListeners = router.__withRouteListeners.slice(0);

        while (len--) {
            var routeAlive = router.routeAlives[len];

            if (routeAlive.id === routeItem.id) {
                routeAlive.component.data.set('route', routeInfo.data);
                if (typeof routeAlive.component.route === 'function') {
                    routeAlive.component.route();
                }
                isUpdateAlive = true;
            }
            else {
                routeAlive.component.dispose();
                router.routeAlives.splice(len, 1);
            }
        }

        if (!isUpdateAlive) {
            if (routeItem.Component) {
                if (isComponent(routeItem.Component)) {
                    routerAttachComponent(router, routeInfo);
                }
                else {
                    routeItem.Component().then(
                        function (Cmpt) { // eslint-disable-line
                            if (isComponent(Cmpt)) {
                                routeItem.Component = Cmpt;
                            }
                            else if (Cmpt.__esModule && isComponent(Cmpt['default'])) {
                                routeItem.Component = Cmpt['default'];
                            }
                            routerAttachComponent(router, routeInfo);
                        }
                    );
                }
            }
            else {
                routeItem.handler.call(router, routeInfo.data);
            }
        }

        for (var i = 0, l = withRouteListeners.length; i < l; i++) {
            withRouteListeners[i](routeInfo);
        }
    }


    function routerAttachComponent(router, routeInfo) {
        var routeItem = routeInfo.route;
        var component = new routeItem.Component();
        component['$router'] = router;
        component.data.set('route', routeInfo.data);
        if (typeof component.route === 'function') {
            component.route();
        }

        var target = routeItem.target;
        var targetEl = elementSelector(target);

        if (!targetEl) {
            throw new Error('[SAN-ROUTER ERROR] '
                + 'Attach failed, target element "'
                + routeItem.target + '" is not found.'
            );
        }

        component.attach(targetEl);

        router.routeAlives.push({
            component: component,
            id: routeItem.id
        });

        // component handler 同时存在
        if (typeof routeItem.handler === 'function') {
            setTimeout(function () {
                routeItem.handler.call(router, routeInfo.data);
            });
        }
    }


    var router = new Router();

    var extendsAsClass;
    try {
        extendsAsClass = new Function('RawClass', "return class extends RawClass {}");
    }
    catch (ex) {}
    function extendsAsFunc(RawClass) {
        var F = new Function();
        F.prototype = RawClass.prototype;

        var NewClass = function (option) {
            return RawClass.call(this, option) || this;
        };

        NewClass.prototype = new F();
        NewClass.prototype.constructor = NewClass;

        if (F.prototype.hasOwnProperty('aPack')) {
            NewClass.prototype.aPack = F.prototype.aPack;
        }

        return NewClass;
    }
    function extendsComponent(ComponentClass) {
        var NewComponentClass;
        if (ComponentClass.toString().indexOf('class') === 0) {
            NewComponentClass = extendsAsClass(ComponentClass);
        }
        else {
            NewComponentClass = extendsAsFunc(ComponentClass);
        }

        NewComponentClass.template = ComponentClass.template;
        NewComponentClass.components = ComponentClass.components;
        NewComponentClass.trimWhitespace = ComponentClass.trimWhitespace;
        NewComponentClass.delimiters = ComponentClass.delimiters;
        NewComponentClass.autoFillStyleAndId = ComponentClass.autoFillStyleAndId;
        NewComponentClass.filters = ComponentClass.filters;
        NewComponentClass.computed = ComponentClass.computed;
        NewComponentClass.aPack = ComponentClass.aPack;
        NewComponentClass.messages = ComponentClass.messages;

        return NewComponentClass;
    }

    /**
     * 为组件生成支持路由关联的高阶组件
     *
     * @param {Function|Class} ComponentClass 组件类
     * @param {Router?} customRouter 关联的 router 实例
     * @returns 高阶组件
     */
    function withRoute(ComponentClass, customRouter) {
        customRouter = customRouter || router;

        var componentProto;
        var ReturnTarget;
        var extProto;

        if (typeof ComponentClass === 'function') {
            ReturnTarget = extendsComponent(ComponentClass);
            componentProto = ComponentClass.prototype;
            extProto = ReturnTarget.prototype;
        }
        else {
            componentProto = ComponentClass || {};
            ReturnTarget = Object.assign({}, ComponentClass);
            extProto = ReturnTarget;
        }

        // 注入 $router 以及 data route
        var inited = componentProto.inited;
        extProto.inited = function () {
            this.$router = customRouter;

            this.data.set(
                'route',
                customRouter.match(
                    customRouter.locator.current,
                    customRouter.locator.referrer
                ).data
            );
            if (typeof this.route === 'function') {
                this.route();
            }

            // 路由信息实时获取
            var me = this;
            this.__routerListener = function (e) {
                me.data.set('route', e.data);
                if (typeof me.route === 'function') {
                    me.route();
                }
            };
            customRouter.__withRouteListeners.push(this.__routerListener);

            if (typeof inited === 'function') {
                inited.call(this);
            }
        };

        // dispose 监听器
        var disposed = componentProto.disposed;
        extProto.disposed = function () {
            if (this.$router) {
                // unlisten from router
                var listeners = this.$router.__withRouteListeners;
                var len = listeners.length;
                while (len--) {
                    if (listeners[len] === this.__routerListener) {
                        listeners.splice(len, 1);
                        break;
                    }
                }

                this.__routerListener = null;
                this.$router = null;
            }

            if (typeof disposed === 'function') {
                disposed.call(this);
            }
        };

        return ReturnTarget;
    }

    function createLink(router) {
        return {
            template: '<a href="{{hrefPrefix}}{{href}}" onclick="return false;" on-click="clicker($event)" '
                + 'target="{{target}}" class="{{isActive ? activeClass : \'\'}}"><slot/></a>',

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
                var me = this;
                this.routeListener = function (e) {
                    me.data.set('isActive', e.url === me.data.get('href'));
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
        };
    }

    var main = {
        Link: createLink(router),
        createLink: createLink,
        withRoute: withRoute,
        router: router,
        Router: Router,
        HashLocator: HashLocator,
        HTML5Locator: HTML5Locator,
        resolveURL: resolveURL,
        parseURL: parseURL,
        stringifyURL: stringifyURL,

        version: '2.0.1'
    };


    if (typeof exports === 'object' && typeof module === 'object') {
        // For CommonJS
        exports = module.exports = main;
    }
    else if (typeof define === 'function' && define.amd) {
        // For AMD
        define('san-router', [], main);
    }
    else {
        root.sanRouter = main;
    }

})(this);
