/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file 提供事件相关操作的基类
 * @author otakustay, errorrik
 */

export default class EventTarget {
    /**
     * 注册一个事件处理函数
     *
     * @param {string} type 事件的类型
     * @param {Function | boolean} fn 事件的处理函数
     */
    on(type, fn) {
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
    }


    /**
     * 注销一个事件处理函数
     *
     * @param {string} type 事件的类型，如果值为`*`仅会注销通过`*`为类型注册的事件，并不会将所有事件注销
     * @param {Function} [fn] 事件的处理函数，无此参数则注销`type`指定类型的所有事件处理函数
     */
    un(type, fn) {
        if (!this._eventListeners || !this._eventListeners[type]) {
            return;
        }

        if (!fn) {
            this._eventListeners[type] = [];
        }
        else {
            let listeners = this._eventListeners[type];
            let len = listeners.length;

            while (len--) {
                if (listeners[len] === fn) {
                    listeners.splice(len, 1);
                }
            }
        }
    }

    /**
     * 触发指定类型的事件
     *
     * @param {string} type 事件类型
     * @param {*} [args] 事件对象
     */
    fire(type, args) {
        if (!type) {
            throw new Error('No event type specified');
        }

        let listeners = this._eventListeners && this._eventListeners[type];
        if (listeners) {
            for (let i = 0; i < listeners.length; i++) {
                listeners[i](args);
            }
        }
    }
}
