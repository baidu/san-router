---
id: programmatic-navigation
sidebar_label: 编程式路由
slug: '/guide/programmatic-navigation'
title: '编程式路由'
---

除了使用 `<link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。比如使用 `router.push` 导航到特定的路由切换视图，这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL。点击 `<link to="...">` 相当于调用 `router.push(...)` ：

```javascript
router.push({
  	path: '/book'
    query: {
        name: 'errik'
    }
});

// san 组件中
this.$router.push({
  	path: '/book'
    query: {
        name: 'errik'
    }
});
```

这里的 query 会作为 query 参数添加到 url 后面，比如这里的 `/book?name=errik`。在路由组件或者通过 `withRoute` 包裹的组件中可以获取到这些参数。

```javascript
const BookDetail = san.defineComponent({
  	template: '<div></div>',
  	attached: function () {
        this.data.get('route').queryString === 'name=errik'
    }
})
```
