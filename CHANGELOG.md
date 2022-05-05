### 1.2.5

- [feature] add 允许添加 config 数组
- [feature] 增加 withRoute 用于为 san 组件增加 `this.$router` 访问 router 实例，增加 `this.data.get('route')` 访问当前路由信息

### 1.2.4

- [feature] `router` 增加 `push` 方法
- [feature] 在 san 组件中通过 `this.$router` 可以访问 router 实例
- [fix] 修复 HashLocator 原型指向问题

### 1.2.3

- [fix] 修复在 san 3.10.2 版本不支持 callHook 的问题，不再依赖此实现。
