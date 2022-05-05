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

### push

使用：

```router.push({Object}url[,{Object}options])```

说明：

功能类似 `router.locator.redict` 方法，并增加了对 query 对象的处理。同时在 san 组件中可通过实例的 `$router` 对象访问当前路由实例：

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

### start

使用：

```router.start()```

说明：

用于启动路由。

### stop

使用：

```router.stop()```

说明：

用于停止路由。

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
