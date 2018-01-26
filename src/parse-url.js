/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 *
 * @file 解析URL
 * @author errorrik
 */


/**
 * 解析URL，返回包含path、query、queryString的对象
 *
 * @param {string} url 要解析的url
 * @return {Object}
 */
export default function parseURL(url) {
    const result = {
        hash: '',
        queryString: '',
        params: {},
        query: {},
        path: url
    };

    // parse hash
    const hashStart = result.path.indexOf('#');
    if (hashStart >= 0) {
        result.hash = result.path.slice(hashStart + 1);
        result.path = result.path.slice(0, hashStart);
    }

    // parse query
    const query = result.query;
    const queryStart = result.path.indexOf('?');
    if (queryStart >= 0) {
        result.queryString = result.path.slice(queryStart + 1);
        result.path = result.path.slice(0, queryStart);

        result.queryString.split('&').forEach(querySeg => {
            // 考虑到有可能因为未处理转义问题，
            // 导致value中存在**=**字符，因此不使用`split`函数
            let equalIndex = querySeg.indexOf('=');
            let value = '';
            if (equalIndex > 0) {
                value = querySeg.slice(equalIndex + 1);
                querySeg = querySeg.slice(0, equalIndex);
            }

            let key = decodeURIComponent(querySeg);
            value = decodeURIComponent(value);

            // 已经存在这个参数，且新的值不为空时，把原来的值变成数组
            if (query.hasOwnProperty(key)) {
                /* eslint-disable */
                query[key] = [].concat(query[key], value);
                /* eslint-disable */
            }
            else {
                query[key] = value;
            }
        });

    }

    return result;
}
