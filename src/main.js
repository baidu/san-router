/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file 主模块
 * @author errorrik
 */

import HashLocator from './locator/hash';
import HTML5Locator from './locator/html5';
import parseURL from './util/parse-url';
import Link from './component/link';
import elementSelector from './util/element-selector';

let routeID = 0x5942b;
let guid = () => (++routeID).toString();

function isComponent(C) {
    return C.prototype && (C.prototype.nodeType === 5 || C.prototype._type === 'san-cmpt');
}

/**
 * 版本号
 *
 * @type {string}
 */
export let version = '1.2.0';

/**
 * 路由器类
 *
 * @class
 */
export class Router {

    /**
     * 构造函数
     *
     * @param {Object?} options 初始化参数
     * @param {string?} options.mode 路由模式，hash | html5
     */
    constructor({mode = 'hash'} = {}) {
        this.routes = [];
        this.routeAlives = [];
        this.listeners = [];

        /**
         * locator redirect 事件监听函数
         *
         * @param {Object} e locator事件对象
         */
        this.locatorRedirectHandler = e => {
            let url = parseURL(e.url);
            let routeItem;

            for (let i = 0; i < this.routes.length; i++) {
                let item = this.routes[i];
                let match = item.rule.exec(url.path);

                if (match) {
                    routeItem = item;

                    // fill params
                    let keys = item.keys || [];
                    for (let j = 1; j < match.length; j++) {
                        const key = keys[j] || j;
                        const value = match[j];
                        url.query[key] = value;
                        url.params[key] = value;
                    }

                    // fill referrer
                    url.referrer = e.referrer;
                    url.config = item.config;

                    break;
                }
            }

            let i = 0;
            let state = 1;

            /**
             * listener 事件对象
             *
             * @type {Object}
             */
            let listenerEvent = {
                hash: url.hash,
                queryString: url.queryString,
                query: url.query,
                path: url.path,
                referrer: url.referrer,
                config: url.config,
                resume: next,
                suspend() {
                    state = 0;
                },
                stop() {
                    state = -1;
                }
            };

            /**
             * 尝试运行下一个listener
             *
             * @inner
             */
            let doNext = () => {
                if (state > 0) {
                    if (i < this.listeners.length) {
                        this.listeners[i].call(this, listenerEvent, url.config);
                        if (state > 0) {
                            next();
                        }
                    }
                    else {
                        routeAction();
                    }
                }
            };

            /**
             * 运行下一个listener
             *
             * @inner
             */
            function next() {
                state = 1;
                i++;
                doNext();
            }

            /**
             * 运行路由行为
             *
             * @inner
             */
            let routeAction = () => {
                if (routeItem) {
                    this.doRoute(routeItem, url);
                }
                else {
                    let len = this.routeAlives.length;
                    while (len--) {
                        this.routeAlives[len].component.dispose();
                        this.routeAlives.splice(len, 1);
                    }
                }
            };

            doNext();
        };

        this.setMode(mode);
    }

    /**
     * 添加路由监听器
     *
     * @param {function(e, config)} listener 监听器
     */
    listen(listener) {
        this.listeners.push(listener);
    }

    /**
     * 移除路由监听器
     *
     * @param {Function} listener 监听器
     */
    unlisten(listener) {
        let len = this.listeners.length;
        while (len--) {
            if (this.listeners[len] === listener) {
                this.listeners.splice(len, 1);
            }
        }
    }

    /**
     * 执行路由
     *
     * @private
     * @param {Object} routeItem 路由项
     * @param {Object} e 路由信息
     */
    doRoute(routeItem, e) {
        let isUpdateAlive = false;
        let len = this.routeAlives.length;

        while (len--) {
            let routeAlive = this.routeAlives[len];

            if (routeAlive.id === routeItem.id) {
                routeAlive.component.data.set('route', e);
                routeAlive.component._callHook('route');
                isUpdateAlive = true;
            }
            else {
                routeAlive.component.dispose();
                this.routeAlives.splice(len, 1);
            }
        }

        if (!isUpdateAlive) {
            if (routeItem.Component) {
                if (isComponent(routeItem.Component)) {
                    this.attachCmpt(routeItem, e);
                }
                else {
                    routeItem.Component().then(Cmpt => { // eslint-disable-line
                        if (isComponent(Cmpt)) {
                            routeItem.Component = Cmpt;
                        }
                        else if (Cmpt.__esModule && isComponent(Cmpt.default)) {
                            routeItem.Component = Cmpt.default;
                        }
                        this.attachCmpt(routeItem, e);
                    });
                }
            }
            else {
                routeItem.handler.call(this, e);
            }
        }
    }

    attachCmpt(routeItem, e) {
        const component = new routeItem.Component();
        component.data.set('route', e);
        component._callHook('route');

        let target = routeItem.target;
        let targetEl = elementSelector(target);

        if (!targetEl) {
            throw new Error('[SAN-ROUTER ERROR] '
                + 'Attach failed, target element "'
                + routeItem.target + '" is not found.'
            );
        }

        component.attach(targetEl);

        this.routeAlives.push({
            component,
            id: routeItem.id
        });
    }

    /**
     * 添加路由项
     * 当规则匹配时，路由将优先将Component渲染到target中。如果没有包含Component，则执行handler函数
     *
     * @private
     * @param {Object} config 路由项配置
     * @param {string|RegExp} config.rule 路由规则
     * @param {Function?} config.handler 路由函数
     * @param {Function?} config.Component 路由组件
     * @param {string} config.target 路由组件要渲染到的目标位置
     * @return {Object} san-router 实例
     */
    add(config) {
        let {rule, handler, target = '#main', Component} = config;
        let keys = [''];

        if (typeof rule === 'string') {
            // 没用path-to-regexp，暂时不提供这么多功能支持
            let regText = rule.replace(
                /\/:([a-z0-9_-]+)(?=\/|$)/ig,
                (match, key) => {
                    keys.push(key);
                    return '/([^/\\s]+)';
                }
            );

            rule = new RegExp('^' + regText + '$', 'i');
        }

        if (!(rule instanceof RegExp)) {
            throw new Error('[SAN-ROUTER ERROR] Rule must be string or RegExp!');
        }

        let id = guid();
        this.routes.push({id, rule, handler, keys, target, Component, config});

        return this;
    }

    /**
     * 启动路由功能
     *
     * @return {Object} san-router 实例
     */
    start() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.locator.on('redirect', this.locatorRedirectHandler);
            this.locator.start();
            this.locator.reload();
        }

        return this;
    }

    /**
     * 停止路由功能
     *
     * @return {Object} san-router 实例
     */
    stop() {
        this.locator.un('redirect', this.locatorRedirectHandler);
        this.locator.stop();
        this.isStarted = false;

        return this;
    }

    /**
     * 设置路由模式
     *
     * @param {string} mode 路由模式，hash | html5
     * @return {Object} san-router 实例
     */
    setMode(mode) {
        mode = mode.toLowerCase();
        if (this.mode === mode) {
            return;
        }

        this.mode = mode;

        let restart = false;
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
    }
}

/**
 * 默认的路由器实例
 *
 * @type {Router}
 */
export let router = new Router();

/**
 * 路由链接的 San 组件
 *
 * @class
 */
export {Link};
