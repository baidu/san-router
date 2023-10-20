---
id: api
sidebar_label: API
slug: '/api'
title: 'API'
---

## router

路由器对象。

路由器用于将特定的 URL 匹配到对应的组件类上。在 URL 变化并匹配到具体的路由规则时，路由将初始化对应的组件并渲染到页面上。你也可以将 URL 映射到特定的函数上，路由将在 URL 匹配到对应规则时执行该函数。

### add

使用：

```router.add({Object|Array}options)```

说明：

添加一条路由规则或者一组路由规则。

参数：

- `string|RegExp` options.rule - 路由规则
- `Function` options.Component - 规则匹配时渲染的组件类
- `string` options.target - 组件渲染的容器元素，默认值为 **#main**
- `Function` options.handler - 规则匹配时的执行的函数

### listen

使用：

```router.listen({Function}listener)```

说明：

添加路由监听函数，当路由发生变化时，监听函数会被触发。

参数：

- `Function` listener - 监听器函数

监听器函数参数：

- `Object` e - 路由信息对象
- `Object` config - 路由配置对象

### unlisten

使用：

```router.unlisten({Function}listener)```

说明：

移除路由监听函数。

参数：

- `Function` listener - 监听器函数


### setMode

使用：

```router.setMode({String}mode)```

说明：

设置路由模式。支持 `hash` 和 `html5` 两种路由模式，默认为 `hash`。

参数：

- `string` mode - 路由模式，`hash` 或 `html5`

### locator

说明：

[locator](/san-router/docs/api#Locator) 为 router 实例上的对象，可以利用 `router.locator.redirect` 实现跳转，利用 `router.locator.reload` 刷新当前路由。

### push

使用：

```router.push({Object|string}url[,{Object}options])```

说明：

用于跳转到某个 url 地址并切换对应的视图，功能类似 `router.locator.redirect` 方法，并增加了对 query 对象的处理。同时在 san 组件中可通过实例的 `$router` 对象访问当前路由实例：

```javascript
router.push({
    query: {
        name: 'erik',
        sex: 1,
        age: 18
    }
});

// san 组件中
this.$router.push({
    query: {
        name: 'erik',
        sex: 1,
        age: 18
    }
});
```

### replace

使用：

```router.replace({Object|string}url[,{Object}options])```

说明：

与 push 类似，区别是该 api 用于替换历史栈中的当前记录来导航到一个新的 URL。在 san 组件中可通过实例的 `$router` 对象访问当前路由实例：

```javascript
router.replace({
    query: {
        name: 'erik',
        sex: 1,
        age: 18
    }
});

// san 组件中
this.$router.replace({
    query: {
        name: 'erik',
        sex: 1,
        age: 18
    }
});
```

### start

使用：

```router.start()```

说明：

用于启动路由功能。

### stop

使用：

```router.stop()```

说明：

用于停止路由功能。

## Link

具有路由功能的应用中，建议使用 `Link` 组件代替 a 标签。`Link` 组件可以根据路由模式渲染一个链接。通过 `to` 属性指定目标地址，从而让 `Link` 组件可以渲染一个带有正确地址的 a 标签。

## withRoute

使用：

```withRoute({Function|Class}component[,{Object}router])```

说明：

为组件实例添加名为 `$router` 的 `san-router` 实例，为组件实例 `data` 对象添加 `route`  [路由信息](/san-router/docs/data-structure#routeInfo)数据。

参数：

- `Function|Class ` component -  组件
- `Object` router - san-router 实例

## Locator

Locator 用于监听 url 变化，修改 url 并触发 router 的跳转行为。分为两种 HTML5Locator 以及 HashLocator，前者基于 html5 的 history api 实现，后者基于 url 的 hash 实现。单独使用该对象无法触发 san 组件的视图切换，建议使用 `router.push` api。如果需要使用该对象，需要自己实现组件视图的切换逻辑。

### on

使用：

```locator.on({string} type,{Function} fn)```

说明：

注册事件处理函数。

### un

使用：

```locator.un({string} type,{Function} fn)```

说明：

删除事件处理函数。

### fire

使用：

```locator.fire({string} type[,{*}args])```

说明：

触发事件。

### start

使用：

```locator.start()```

说明：

用于启动路由监听与切换功能。

### stop

使用：

```locator.stop()```

说明：

用于停止路由监听与切换功能。

### redirect

使用：

```locator.redirect({String}url[,{Object}options])```

说明：

用于跳转到某个 url 地址，并触发 redirect 事件。

参数：

- `string` url - 跳转地址
- `boolean` options.force - 路由规则


### reload

使用：

```locator.reload()```

说明：

触发 redirect 事件，并且事件传递的参数为当前 url 以及上一次的 url。

参数：

- `string` url - 跳转地址
- `boolean` options.force - 路由规则

### redirect 事件

说明：重定向事件，该事件用于渲染路由对应的 san 组件切换视图。

参数：

- `string` url - 目的地址
- `string` referrer - 源地址

## URL
router 内部用于处理 url 的工具函数。

### resolveURL
使用：

```resolveURL({String}url, {String}base)```

说明：

将 URL 中相对路径部分展开

参数：

- `string` url - 要展开的url
- `string` base - 当前所属环境的url

### parseURL

使用：

```parseURL({String}url)```

说明：

解析URL，返回包含path、query、queryString的对象

参数：

- `string` url - 要解析的url

### stringifyURL
使用：

```stringifyURL({Object}source)```

说明：

将解析后的 URL 对象，转换成字符串

参数：

- `Object` source - 解析后的URL对象
