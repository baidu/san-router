# san-router

[![NPM version](http://img.shields.io/npm/v/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)
[![License](https://img.shields.io/github/license/baidu/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)

[San](https://baidu.github.io/san/) 框架的官方 router，支持动态路由，嵌套路由，路由懒加载以及导航守卫等功能。

> 注意：使用 san-router，要求 San 的版本号 >= 3.0.2

[文档](https://baidu.github.io/san-router/) | [示例项目](https://github.com/baidu/san/tree/master/example/todos-esnext)

## 下载

```
# use npm
npm i san-router
# or use yarn
yarn add san-router
```

## 使用

如需了解更多功能，请移步：[快速开始](https://baidu.github.io/san-router/docs/quick-start)

```
import {router, Link} from 'san-router';

router.add({
    rule: '/book',
    Component: BookDetail
});
router.add([
    {
        rule: '/about',
        Component: About
    },
    {
        rule: '/home',
        Component: Home
    }
]);
router.start();
```

## CHANGELOG

[CHANGELOG](https://github.com/baidu/san-router/blob/master/CHANGELOG.md)
