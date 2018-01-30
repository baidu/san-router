/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file hash 模式地址监听器
 * @author errorrik
 */

import EventTarget from '../util/event-target';
import resoveURL from '../util/resolve-url';

/**
 * 获取当前URL
 *
 * @return {string}
 */
function getLocation() {
    // Firefox下`location.hash`存在自动解码的情况，
    // 比如hash的值是**abc%3def**，
    // 在Firefox下获取会成为**abc=def**
    // 为了避免这一情况，需要从`location.href`中分解
    let index = location.href.indexOf('#');
    let url = index < 0 ? '/' : (location.href.slice(index + 1) || '/');

    return url;
}


/**
 * hash 模式地址监听器
 *
 * @class
 */
export default class Locator extends EventTarget {

    /**
     * 构造函数
     */
    constructor() {
        super();

        this.current = getLocation();
        this.referrer = '';

        this.hashChangeHandler = () => {
            this.redirect(getLocation());
        };
    }

    /**
     * 开始监听 url 变化
     */
    start() {
        if (window.addEventListener) {
            window.addEventListener('hashchange', this.hashChangeHandler, false);
        }

        if (window.attachEvent) {
            window.attachEvent('onhashchange', this.hashChangeHandler);
        }
    }

    /**
     * 停止监听
     */
    stop() {
        if (window.removeEventListener) {
            window.removeEventListener('hashchange', this.hashChangeHandler, false);
        }

        if (window.detachEvent) {
            window.detachEvent('onhashchange', this.hashChangeHandler);
        }
    }

    /**
     * 重定向
     *
     * @param {string} url 重定向的地址
     * @param {Object?} options 重定向的行为配置
     * @param {boolean?} options.force 是否强制刷新
     */
    redirect(url, options = {force: false}) {
        url = resoveURL(url, this.current);
        let referrer = this.current;

        let isChanged = url !== referrer;
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
    }

    /**
     * 刷新当前 url
     */
    reload() {
        this.redirect(this.current, {force: true});
    }
}
