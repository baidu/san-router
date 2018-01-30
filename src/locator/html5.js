/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file html5 模式地址监听器
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
    return location.pathname + location.search;
}


/**
 * html5 模式地址监听器
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

        this.popstateHandler = () => {
            this.referrer = this.current;
            this.current = getLocation();

            this.fire('redirect', {
                url: this.current,
                referrer: this.referrer
            });
        };
    }

    /**
     * 开始监听 url 变化
     */
    start() {
        window.addEventListener('popstate', this.popstateHandler);
    }

    /**
     * 停止监听
     */
    stop() {
        window.removeEventListener('popstate', this.popstateHandler);
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

            history.pushState({}, '', url);
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url, referrer});
        }
    }

    /**
     * 刷新当前 url
     */
    reload() {
        this.fire('redirect', {
            url: this.current,
            referrer: this.referrer
        });
    }
}

Locator.isSupport = 'pushState' in window.history;
