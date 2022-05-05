---
id: navigation-guards
sidebar_label: 导航守卫
slug: '/guide/navigation-guards'
title: '导航守卫'
---

### 基本用法

你可以使用 `route.listen` 添加路由监听器，用于全局前置守卫；当发生路由行为时，监听器函数被触发。

```javascript
import {router} from 'san-router';
router.listen(function (/* listener 事件对象 */listenerEvent) {
    // 取消导航跳转
    listenerEvent.stop();
});
```

每个守卫方法都会接收一个事件对象参数：

- listenerEvent：路由事件对象，参考[listenerEvent](/san-router/docs/data-structure#listenerevent)

### 路由重定向

路由监听器作为所有路由的切面函数，通常承担权限判断之类基础的任务。所以路由监听器可以通过 `stop` 方法阻断当前路由过程，并进行 URL 跳转。

```javascript
router.listen(function (e) {
    if (!checkPermission()) {
        e.stop();
        this.locator.redirect('/forbidden');
    }
});
```

### 中断/唤醒路由过程

路由监听器可以通过 `suspend` 和 `resume` 方法中断和唤醒路由过程，实现异步。不过异步过程会导致路由对应的视图渲染延迟，请慎用这两个方法。

```javascript
router.listen(function (e) {
    e.suspend();
    checkPermission().then(invalid => {
        if (invalid) {
            e.stop();
            this.locator.redirect('/forbidden');
            return;
        }

        e.resume();
    });
});
```
