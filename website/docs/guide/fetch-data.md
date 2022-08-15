---
id: fetch-data
sidebar_label: 获取数据
slug: '/guide/fetch-data'
title: '获取数据'
---

有时候，进入某个路由后，需要从服务器获取数据。例如，在渲染用户信息时，你需要从服务器获取用户的数据。

但是如果源地址和目的跳转地址符合动态路由规则的时候，比如对于动态路由 book/:id，从 book/1 跳转到 book/2，那么组件并不会触发 attached 生命周期钩子函数，但是触发 updated 生命周期钩子函数，而 updated 在组件首次挂载的时候不会触发，因此如果想要在组件展现的时候获取数据，那么在 attached 以及 updated 生命周期钩子函数中都需要有获取数据的逻辑。

为了简化代码，san-router 为每个路由组件添加了 route 钩子函数，每次路由触发组件展现的时候都会执行。

### 通过路由组件的 route 钩子函数获取数据

下面的代码为路由跳转并完成展示组件之前，在 route 方法中获取数据的实例：

```javascript
san.defineComponent({
    components: {
        'router-link': Link
    },

    template: `
        <div>
            <div s-for="item, index in list">
                <span>{{item.title}}</span>
                <span>{{item.desc}}</span>
            </div>
        </div>
    `,

    initData() {
        list: []
    }

    route() {
        fetchData().then((res) => {
            this.data.set('list', res);
        });
    }
});
```
