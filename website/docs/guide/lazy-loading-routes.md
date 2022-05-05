---
id: lazy-loading-routes
sidebar_label: 路由懒加载
slug: '/guide/lazy-loading-routes'
title: '路由懒加载'
---

当页面足够复杂，并且具备多个路由的情况下，应用的包体积会非常大，从而增加页面加载时间，对用户体验造成非常大的影响。为了提升性能，把代码按照路由拆成多个 JavaScript 模块是非常必要的。

san 支持动态导入，因此你可以将静态导入替换成动态导入即可：

```javascript
const BookComponent = () => import('./BookComponent');
const Home = () => import('./Home');
const About = () => import('./About');

router.add([
    {
        rule: '/book/',
        Component: BookComponent,
        target: '#app'
    },
    {
        rule: '/home',
        Component: Home,
        target: '#app'
    },
        {
        rule: '/about',
        Component: About,
        target: '#app'
    }
]);
```
