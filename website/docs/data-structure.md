---
id: data-structure
sidebar_label: 数据结构
slug: '/data-structure'
title: '数据结构'
---

### routeConfigInfo

| 名称      | 说明                                                         | 类型              |
| --------- | ------------------------------------------------------------ | ----------------- |
| rule      | 路由规则                                                     | string            |
| Component | 路由组件                                                     | function \| class |
| target    | 需要挂载的目标 dom 或者 dom 选择器                           | string \| object  |
| handler   | 如果没有指定 Component，则在路由切换的时候执行该函数；如果指定了 Component，则在路由切换之后，Component 挂载之后立即执行该函数 | function          |

### listenerEvent

| 名称        | 说明                 | 类型     |
| ----------- | -------------------- | -------- |
| url         | 当前 url，比如 /home | string   |
| referrer    | 上一次 url           | string   |
| hash        | 当前 hash            | string   |
| params      | url 经过路由匹配的参数 | object   |
| query       | url 参数             | object   |
| queryString | query 字符串形式     | string   |
| resume      | 恢复导航过程         | function |
| stop        | 取消导航             | function |

### routeInfo

| 名称        | 说明                 | 类型   |
| ----------- | -------------------- | ------ |
| url         | 当前 url，比如 /home | string |
| referrer    | 上一次 url           | string |
| hash        | 当前 hash            | string |
| params      | url 参数             | object |
| query       | url 参数             | object |
| queryString | query 字符串形式     | string |
