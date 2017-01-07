# san-router

[![NPM version](http://img.shields.io/npm/v/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)
[![License](https://img.shields.io/github/license/ecomfe/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)

[San](https://ecomfe.github.io/san/) 框架的官方 router。通常，单页或同构的 Web 应用都会需要一个 router。

你可以从下面找到 san-router 的下载和使用说明，也可以直接从 [示例项目](https://github.com/ecomfe/san/tree/master/example/todos-esnext) 看看实际项目中的使用方法。 

> 注意：使用 san-router，要求 San 的版本号 >= 3.0.1


下载
----

NPM:

```
$ npm i san-router
```


使用
----

### Webpack + Babel

通过 import 我们可以导入

```javascript
import {router, Link} form 'san-router';

router.add({
    rule: '/book/:id',
    Component: BookDetail
});
router.start();
```


API
----

### router

路由器对象。

路由用于将特定的 URL 对应到组件类上。在 URL 变化并匹配路由规则时，路由将初始化特定组件并渲染到页面上。你也可以将 URL 对应到函数上，路由将在 URL 规则匹配时执行特定函数。


#### add({Object}options)

`说明`

添加一条路由规则。

你可以指定 Component 和 target 参数，让规则匹配时在 target 中渲染一个 Component。

```javascript
router.add({
    rule: '/book/:id',
    Component: san.defineComponent({
        route() {
            let route = this.data.get('route');
            // route.query.id
        }
    }),
    target: '.app-main'
});
```

你也可以指定一个 handler 函数，让规则匹配时执行这个函数。

```javascript
router.add({
    rule: '/book/:id',
    handler(e) {
        e.query.id
    }
});
```

路由规则有2种形式：

- `string` URL 的 path 部分与字符串完全匹配。支持 `:` 标记的路径参数，根据名称作为 query 的参数传递给相应的组件或函数。
- `RegExp` URL 的 path 部分匹配该正则。正则中的 group 将根据序号作为 query 的参数传递给相应的组件或函数。

`参数`

- `string|RegExp` options.rule - 路由规则
- `Function` options.Component - 规则匹配时渲染的组件类
- `string` options.target - 组件渲染的容器元素，默认值为 **#main**
- `Function` options.handler 规则匹配时的执行函数

#### setMode({string}mode)

`说明`

设置路由模式。支持两种模式：hash | html5，默认为 hash。

`参数`

- `string` mode - 路由模式，hash | html5

#### start()

`说明`

启动路由


#### stop()

`说明`

停止路由


### Link

具有路由功能的应用中，建议使用 Link 组件代替 a 标签。Link 组件可以根据路由模式渲染一个链接。通过 to 属性指定目标地址，Link 组件将渲染一个带有正确地址的 a 标签。


```javascript
san.defineComponent({
    components: {
        'router-link': Link
    },

    template: `
        <div>
            <header>
                <router-link to="/user">用户信息</router-link>
            </header>
        </div>
    `
});
```




