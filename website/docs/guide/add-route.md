---
id: add-route
sidebar_label: 添加路由
slug: '/guide/add-route'
title: '添加路由'
---

### 添加路由规则

san-router 提供了默认的路由器对象 [router](/san-router/docs/api#router)，我们可以通过该实例添加一条路由信息或者一组 [路由配置信息](/san-router/docs/data-structure#routeconfiginfo)；你可以指定 `Component` 和 `target` 参数，让规则匹配时以 `target` 为容器渲染一个 `Component` 指定的组件。

```javascript
router.add({
    rule: '/book/:id',
    Component: san.defineComponent({
        route() {
            let route = this.data.get('route');
            // route.query.id
        }
    }),
    target: '.app-main'
});
router.add([
    {
        rule: '/home',
        Component: Home,
        target: '.app-main'
    },
		{
        rule: '/about',
        Component: About,
        target: '.app-main'
    }
]);
```

`Component` 属性也可以用来加载一个异步的组件：

```js
const BookComponent = () => import('./BookComponent');

router.add({
    rule: '/book/:id',
    Component: BookComponent,
    target: '.app-main'
});

```

你也可以指定一个 `handler` 函数，让规则匹配时执行这个函数。

```javascript
router.add({
    rule: '/book/:id',
    handler(e) {
        e.query.id
    }
});
```

路由规则有2种形式：

- `string` URL 的 path 部分与字符串完全匹配。支持 `:` 标记的路径参数，如 `/book/:id`，根据名称作为 query 的参数传递给相应的组件或函数。
- `RegExp` URL 的 path 部分匹配该正则。正则中的 group 将根据序号作为 query 的参数传递给相应的组件或函数。


### 设置路由模式

san-router 支持 hash 模式以及 html5 模式，默认的 router 实例是 hash 模式，可以通过 router 的实例方法 `setMode` 设置为 html5 模式：

```javascript
import {router} from 'san-router';
router.setMode('html5');

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
```

同样 san-router 支持多路由实例，可以通过 `Router` 类实例化得到自定义路有实例，并且通过 `mode` 参数选择路由模式： 

```javascript
import {Router} from 'san-router';
const routerHash = new Router({mode: 'hash'})
const routerHistory = new Router({mode: 'html5'})
```

需要注意的是在使用 html5 模式的时候，请确保你的应用想要支持的浏览器版本具备 history API，否则 san-router 会给出报错信息。

### Link

请注意，我们没有使用常规的 a 标签，而是使用一个自定义 `Link` 组件来创建链接。这使得 san-router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。`Link` 组件可以根据路由模式渲染一个链接。通过 `to` 属性指定目标地址，`Link` 组件将渲染一个带有正确地址的 a 标签。

```javascript
san.defineComponent({
    components: {
        'router-link': Link
    },

    template: `
        <div>
            <header>
                <router-link to="/user">用户信息</router-link>
            </header>
        </div>
    `
});
```
