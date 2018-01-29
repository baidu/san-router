/*
*
* @file 选择器
* @author vincent lau/413893093@qq.com
*/

/**
 * 元素选择器
 *
 * @param selector 选择器
 * @returns {*} 返回元素或者undefined
 */
export default function elementSelector(selector) {
    let el;
    if (document.querySelector) {
        el = document.querySelector(selector);
    } else {
        el = document.getElementById(selector.replace(/#/i, ''));
    }
    return el;
}
