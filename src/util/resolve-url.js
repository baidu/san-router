/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file 将 URL 中相对路径部分展开
 * @author errorrik
 */


import parseURL from './parse-url';


/**
 * 将 URL 中相对路径部分展开
 *
 * @param {string} source 要展开的url
 * @param {string} base 当前所属环境的url
 * @return {string}
 */
export default function resolveURL(source, base) {
    let sourceLoc = parseURL(source);
    let baseLoc = parseURL(base);

    let sourcePath = sourceLoc.path;
    if (sourcePath.indexOf('/') === 0) {
        return source;
    }

    let sourceSegs = sourcePath.split('/');
    let baseSegs = baseLoc.path.split('/');
    baseSegs.pop();

    for (let i = 0; i < sourceSegs.length; i++) {
        let seg = sourceSegs[i];
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

    return baseSegs.join('/')
        + (sourceLoc.queryString ? '?' + sourceLoc.queryString : '');
}
