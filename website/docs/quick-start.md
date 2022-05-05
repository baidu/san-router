---
id: quick-start
sidebar_label: 快速开始
slug: '/quick-start'
title: '快速开始'
---

[![NPM version](http://img.shields.io/npm/v/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)
[![License](https://img.shields.io/github/license/baidu/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)

通常来说，单页或同构的 Web 应用都会需要一个 router 来协助控制路由切换以及管理路由信息，并且能够和已使用的业务框架集成。而 san-router 就是 [San](https://baidu.github.io/san/) 框架的官方 router。

下文将介绍如何下载并使用 san-router，如果你向直接了解 san-router 在实际项目中的用法，可以直接访问 [示例项目](https://github.com/baidu/san/tree/master/example/todos-esnext) ，通过源码和运行效果来了解 san-router。

> 注意：使用 san-router，要求 San 的版本号 >= 3.0.2

## 下载

NPM:

```
$ npm i san-router
```

## 使用

### ESM

通过 named import 方式导入：

```javascript
import {router} from 'san-router';

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

### AMD

通过 `require('san-router')` 获取 exports 对象以使用 router：

```javascript
var sanRouter = require('san-router');
var router = sanRouter.router;

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

请为 AMD Loader 配置正确的 san-router 的引用路径，通过 npm 安装的项目可以采用如下配置：

```javascript
require.config({
    baseUrl: 'src',
    paths: {
        'san-router': '../dep/san-router/dist/san-router.source'
    }
});
```

### 完整的 API

无论通过那种模块加载方式，san-router 为开发者提供了丰富的接口和组件来支持路由相关功能的开发，详情参见 san-router 的 [API](/san-router/docs/api)。

## CHANGELOG

[CHANGELOG](https://github.com/baidu/san-router/blob/master/CHANGELOG.md)
