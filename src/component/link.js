/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file 路由链接的 San 组件
 * @author errorrik
 */


import {router} from '../main';
import resolveURL from '../util/resolve-url';

export default {
    template: `<a href="{{hrefPrefix}}{{href}}"
        onclick="return false;"
        on-click="clicker($event)"
        target="{{target}}"
        class="{{isActive ? activeClass : ''}}"
        >
        <slot></slot>
    </a>`,

    clicker(e) {
        let href = this.data.get('href');

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

    inited() {
        this.routeListener = e => {
            this.data.set('isActive', e.url === this.data.get('href'));
        };

        this.routeListener({url: router.locator.current});
        router.listen(this.routeListener);
    },

    disposed() {
        router.unlisten(this.routeListener);
        this.routeListener = null;
    },

    initData() {
        return {
            isActive: false,
            hrefPrefix: router.mode === 'hash' ? '#' : ''
        };
    },

    computed: {
        href() {
            let url = this.data.get('to') || '';
            return resolveURL(url, router.locator.current);
        }
    }
};
