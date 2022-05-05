---
id: dynamic-route-matching
sidebar_label: 动态路由匹配
slug: '/guide/dynamic-route-matching'
title: '动态路由匹配'
---

很多时候，我们需要将命中匹配模式的路由映射到同一个组件。例如，我们可能有一个 `BookDetail` 组件，它应该对所有书籍进行渲染，但不同的书籍的 `ID` 也不同。为了处理这种关系，在 san-router 中，我们可以在路径中使用一个动态字段来实现，我们称之为 *路径参数*:

```javascript
import san from 'san';
import {router} from 'san-router';
router.setMode('html5');

const BookDetail = san.defineComponent({
  	template: '<div></div>'
})

router.add({
    rule: '/book/:id',
    Component: BookDetail
});
```

现在像 `/book/a`  和 `/book/b` 这样的 URL 都会映射到同一个路由。

路径参数用冒号 `:` 表示。当一个路由被匹配时，它的 params 的值将在路由组件中以 `this.data.get('route.query.name')` 的形式暴露出来。因此，我们可以通过更新 `BookDetail` 的模板来呈现当前的书籍的 `ID`：

```javascript
const BookDetail = san.defineComponent({
  	template: '<div>{{route.query.name}}</div>'
})
```

如果想在 `BookDetail` 中的子组件中获取路由参数，那么你可以借助 [withRoute](/san-router/docs/guide/nested-routes) 来实现。

你可以在同一个路由中设置多个 *路径参数*，它们会映射到 `this.data.get('route.query')` 上的相应字段。例如：

| 匹配模式                | 匹配路径       | this.data.get('route.query') |
| ----------------------- | -------------- | ---------------------------- |
| /book/:id               | /book/1        | {id: 1}                      |
| /book/:id/post/:version | /book/1/post/1 | {id: 1, version:1}            |
