/**
 * san-router
 * Copyright 2016 Baidu Inc. All rights reserved.
 *
 * @file 地址监听器对象
 * @author otakustay
 */

import EventTarget from 'mini-event/EventTarget';

const HASH_CHANGE_EVENT_HANDLER = Symbol('hashChangeEventHandler');
const INDEX_URL = Symbol('indexURL');

/**
 * 获取URL中的hash值
 *
 * @return {string} 当前URL中的hash值
 * @ignore
 */
let getLocation = () => {
    // Firefox下`location.hash`存在自动解码的情况，
    // 比如hash的值是**abc%3def**，
    // 在Firefox下获取会成为**abc=def**
    // 为了避免这一情况，需要从`location.href`中分解
    let index = location.href.indexOf('#');
    let url = index === -1 ? '' : location.href.slice(index + 1);

    return url;
};

/**
 * 地址监听对象
 *
 * 该对象用于监听地址中的`hash`部分的变化，以及根据要求更新`hash`值
 *
 * 基本工作流程：
 *
 * 1. 监听`hash`的变化
 * 2. 当`hash`变化时，如果确实发生变化（与上一次的值不同），则执行逻辑
 * 3. 保存当前的地址信息（高版本浏览器此时自动记录历史项）
 * 4. 触发{@link locator#event-redirect}事件
 *
 * 虽然`Locator`被设计为一个类，但强烈建议仅创建一个实例，由于`location.hash`是共享的，多个实例可能产生不可预测的结果
 *
 * @class Locator
 */
export default class Locator extends EventTarget {
    /**
     * 默认构造函数
     */
    constructor() {
        super();

        /**
         * 当前地址，**只读**
         *
         * @property {string} currentLocation
         */
        this.currentLocation = getLocation();

        /**
         * URL的映射关系，**只读**，使用此配置可以指定一个URL映射到另一个URL
         *
         * 默认会将空字符串和`/`映射到`indexURL`上
         *
         * @property {Map} urlMapping
         * @readonly
         */
        this.urlMapping = new Map();

        this[HASH_CHANGE_EVENT_HANDLER] = () => {
            let url = getLocation();
            this.redirect(url);
        };
    }

    /**
     * 首页URL，当前的URL为空字符串或`/`时会使用此地址
     *
     * @property {string} indexURL
     */
    set indexURL(value) {
        this[INDEX_URL] = value;
        this.urlMapping.set('', value);
        this.urlMapping.set('/', value);
    }

    /**
     * 启动
     */
    start() {
        window.addEventListener('hashchange', this[HASH_CHANGE_EVENT_HANDLER], false);
    }

    /**
     * 停止
     */
    stop() {
        window.removeEventListener('hashchange', this[HASH_CHANGE_EVENT_HANDLER], false);
    }

    /**
     * 根据输入的URL，进行处理后获取真实应该跳转的URL地址
     *
     * @param {string | URL} url 重定向的地址
     * @return {string}
     */
    resolveURL(url) {
        // 当类型为URL时，使用`toString`可转为正常的url字符串
        url = url.toString();

        if (this.urlMapping.has(url)) {
            url = this.urlMapping.get(url);
        }

        return url;
    }

    /**
     * 执行重定向逻辑
     *
     * @param {string | URL} url 重定向的地址
     * @param {meta.RedirectOption} [options] 额外附加的参数对象
     * @return {boolean} 返回是否真正进行了跳转操作
     */
    redirect(url, options = {force: false, silent: false, global: false}) {
        url = this.resolveURL(url);

        let referrer = this.currentLocation;
        let isLocationChanged = this.updateURL(url, options);
        let shouldPerformRedirect = isLocationChanged || options.force;
        if (shouldPerformRedirect) {

            /**
             * URL跳转时触发，且不受`RedirectOption#silent`控制
             *
             * @event redirect
             * @param {Object} e 事件对象
             * @param {string} e.url 当前的URL
             * @param {string} e.referrer 来源URL
             */
            this.fire('forward', {url, referrer});

            if (!options.silent) {

                /**
                 * URL跳转时触发
                 *
                 * @event redirect
                 * @param {Object} e 事件对象
                 * @param {string} e.url 当前的URL
                 * @param {string} e.referrer 来源URL
                 */
                this.fire('redirect', {url, referrer});
            }
        }

        return shouldPerformRedirect;
    }

    /**
     * 刷新当前地址
     */
    reload() {
        if (this.currentLocation) {
            this.redirect(this.currentLocation, {force: true});
        }
    }

    /**
     * 更新当前的`hash`值，同时在历史记录中添加该项
     *
     * 如果hash值与当前的地址相同则不会进行更新
     *
     * 注意该函数不会触发`redirect`事件，需要跳转请使用`forward`方法，
     * 直接使用`updateURL`修改地址**后果自负**
     *
     * @param {string} url 需要进行更新的hash值
     * @param {Object} options 配置项
     * @return {boolean} 如果地址有过变更则返回true
     */
    updateURL(url, options) {
        let changed = this.currentLocation !== url;

        // Opera这里有个BUG，但我不打算兼容
        if (changed) {
            location.hash = url;
        }

        this.currentLocation = url;
        return changed;
    }
}
