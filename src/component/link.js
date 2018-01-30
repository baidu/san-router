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
    template: `<a href="{{href}}"
        onclick="return false;"
        on-click="clicker($event)"
        target="{{target}}"
        class="{{class}}"
        style="{{style}}"
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

    computed: {
        href() {
            let url = this.data.get('to');
            if (typeof url !== 'string') {
                return;
            }

            let href = resolveURL(url, router.locator.current);
            if (router.mode === 'hash') {
                href = '#' + href;
            }

            return href;
        }
    }
};
