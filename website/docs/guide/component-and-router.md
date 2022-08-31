---
id: component-and-router
sidebar_label: 路由组件
slug: '/guide/component-and-router'
title: '路由组件'
---

当我们想在组件中通过 router 实例导航到特定的路由，或者想在路由发生变化的时候通过路由信息呈现不同的视图，那么可以通过 `this.$router` 和 `this.data.get('route')` 分别访问路由实例和当前路由信息。据此我们可以将组件分为下面两种情况：

### 通过 router.add 添加的组件

如果组件是通过 `router.add` 添加的路由组件，那么可以直接通过 `this.$router` 访问 router 实例，通过 `this.data.get('route')` 访问当前的路由信息。

除此之外，router 还为该组件添加了 route 钩子函数，每次路由触发组件展现的时候都会执行，该函数通常用于[数据获取](/san-router/docs/guide/fetch-data)。


### withRoute 包裹的组件

对于不是通过 `router.add` 添加的组件，我们可以通过 `withRoute` 包裹组件，这样该组件可以直接通过 `this.$router` 访问 router 实例，通过 `this.data.get('route')` 访问当前的路由信息，比如下面的示例： 

```
const Content = withRoute(san.defineComponent({
    template: `
        <div></div>
    `,
    inited: function () {
        // this.data.get('route')
        // this.$router
    },
    created: function () {
        this.watch('route', routeInfo => {
            // 监听路由导航行为做相应的操作
        });
    }
}));
```
