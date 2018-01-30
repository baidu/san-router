/*
*
* @file 选择器
* @author vincent lau/413893093@qq.com
*/

/**
 * 元素选择器
 *
 * @param {string|Element} selector 选择器
 * @returns {Element}
 */
export default function elementSelector(selector) {
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
