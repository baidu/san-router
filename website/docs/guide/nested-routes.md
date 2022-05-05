---
id: nested-routes
sidebar_label: 嵌套路由
slug: '/guide/nested-routes'
title: '嵌套路由'
---

> 注意：使用 s-is 指令，要求 San 的版本号 >= 3.10.0

一些页面的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构

```javascript
/user/home                     /user/about
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |  +------------>  | +-------------+ |
| | home         | |                  | | about       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

我们可以利用 san-router 提供的 `withRoute` 来实现上述的功能，`withRoute` 会在任意的 san 组件实例 `$router` 属性上挂在路由实例对象 `$router`，并在该组件 data 的 `route` 对象内添加路由信息。我们可以通过该路由信息获取到当前 url 对应的 query 数据，比如如下代码的动态路由参数 `query.name`。获取到 `name` 之后，我们可以利用 san 指令 `s-is` 动态地渲染 `name` 对应的组件。

```javascript
// 获取路由实例
import {withRoute, router, Link} from 'san-router';

// 创建 content
const Home = san.defineComponent({
    template: '<div class="content">home</div>'
});
const About = san.defineComponent({
    template: '<div class="content">about</div>'
});
const Content = withRoute(san.defineComponent({
    template: `
        <div class="abc" style="width:100px;height:100px;background-color:green">
            <div s-is="route.query.name"></div>
        </div>
    `,
    inited: function () {
        myApp = this;
        console.log(this.data.get('route'));
    },
    attached:  function () {
        console.log(this.data.get('route'));
        this.watch('route', (val) => {
            console.log(val);
        })
    },
    components: {
        'home': Home,
        'about': About
    }
}));

// 创建user组件
const User = san.defineComponent({
    template: `
        <div>
            <s-content></s-content>
        </div>
    `,
    components: {
        's-content': Content
    }
});

// 创建 App
const App = san.defineComponent({
    template: `
        <div>
            <router-link to="/user/home">click to home</router-link>
            <router-link to="/user/about">click to about</router-link>
        </div>
    `,
    components: {
        'router-link': Link
    }
});

// 添加路由
router.add([
    {
        rule: '/app',
        Component: App
    },
    {
        rule: '/user/:name',
        Component: User
    }
]);
```
