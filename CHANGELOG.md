### 2.0.1

- [fix] router.push 方法，当不传入 path 并且传入 query 为空时，原有的 location 中的 query 仍被保留


### 2.0.0

- [change] 删除路由相关组件的 route 数据项中的 config 属性
- [change] 删除 router 监听器的第二参数 config。可由第一参数的属性 eventArg.config 获得匹配路由的配置项
- [feature] router.add 方法支持数组参数，批量添加路由
- [feature] 增加 withRoute 方法，支持内层组件的路由感知
- [feature] 增加 createLink 方法，支持创建非默认路由的 Link 组件
- [fix] 当路由 listener 中调用暂停再恢复时，异步组件初始化多次

### 1.2.4

- [feature] `router` 增加 `push` 方法
- [feature] 在 san 组件中通过 `this.$router` 可以访问 router 实例
- [fix] 修复 HashLocator 原型指向问题

### 1.2.3

- [fix] 修复在 san 3.10.2 版本不支持 callHook 的问题，不再依赖此实现。
