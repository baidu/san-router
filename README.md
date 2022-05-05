# san-router

[![NPM version](http://img.shields.io/npm/v/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)
[![License](https://img.shields.io/github/license/baidu/san-router.svg?style=flat-square)](https://npmjs.org/package/san-router)

[San](https://baidu.github.io/san/) 框架的官方 router。通常，单页或同构的 Web 应用都会需要一个 router。

你可以从下面找到 san-router 的下载和使用说明，也可以直接从 [示例项目](https://github.com/baidu/san/tree/master/example/todos-esnext) 看看实际项目中的使用方法。

> 注意：使用 san-router，要求 San 的版本号 >= 3.0.2

## 目录

- [快速开始](#快速开始)
	- [下载](#下载)
	- [使用](#使用)
- [指南](#指南)
	- [添加路由](#添加路由)
	- [动态路由匹配](#动态路由匹配)
	- [编程式导航](#编程式导航)
	- [路由懒加载](#路由懒加载)
	- [嵌套路由](#嵌套路由)
	- [导航守卫](#导航守卫)
- [API](#API)
    - [router](#router)
	    - [router.add](#add)
	    - [router.listen](#listen)
	    - [router.unlisten](#unlisten)
	    - [router.setMode](#setMode)
	    - [router.push](#push)
	    - [router.start](#start)
	    - [router.stop](#stop)
	- [Link](#Link)
	- [withRoute](#withRoute)
- [数据接口](#数据接口)

## 快速开始

### 下载

NPM:

```
$ npm i san-router
```


### 使用

#### Webpack + Babel

通过 named import 导入

```javascript
import {router, Link} from 'san-router';

router.add({
    rule: '/book',
    Component: BookDetail
});
router.add([
    {
        rule: '/about',
        Component: About
    },
    {
        rule: '/home',
        Component: Home
    }
]);
router.start();
```

webpack 环境配置网上有太多文章，在此不赘述了


#### AMD

通过 require 拿到的 exports 上包含 router 和 Link

```javascript
var sanRouter = require('san-router');
var router = sanRouter.router;
var Link = sanRouter.Link;

router.add({
    rule: '/book',
    Component: BookDetail
});
router.add([
    {
        rule: '/about',
        Component: About
    },
    {
        rule: '/home',
        Component: Home
    }
]);
router.start();
```

请为 amd loader 正确配置 san-router 的引用路径。通过 npm 安装的项目可以采用下面的配置

```javascript
require.config({
    baseUrl: 'src',
    paths: {
        'san-router': '../dep/san-router/dist/san-router.source'
    }
});
```

## 指南

### 添加路由

san-router 提供了默认的 router 实例，我们可以通过该实例添加一条路由信息或者一组[路由配置信息](#routeConfigInfo)；san-router 支持 hash 模式以及 html5 模式，默认的 router 实例是 hash 模式，可以通过 router 的实例方法 setMode 设置为 html5 模式：

```javascript
import {router} from 'san-router';
router.setMode('html5');

router.add({
    rule: '/book',
    Component: BookDetail
});
router.add([
    {
        rule: '/about',
        Component: About
    },
    {
        rule: '/home',
        Component: Home
    }
]);
```

同样 san-router 支持多路由实例，可以通过 Router 类实例化得到自定义路有实例，并且通过 参数 mode 选择路由模式： 

```javascript
import {Router} from 'san-router';
const routerHash = new Router({mode: 'hash'})
const routerHistory = new Router({mode: 'html5'})
```

需要注意的是在使用 html5 模式的时候，请确保你的应用想要支持的浏览器版本具备 history API，否则 san-router 会给出报错信息。

### 动态路由匹配

很多时候，我们需要将给定匹配模式的路由映射到同一个组件。例如，我们可能有一个 BookDetail 组件，它应该对所有书籍进行渲染，但书籍 ID 不同。在 San Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为路径参数:

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

现在像 /book/a  和/book/b 这样的 URL 都会映射到同一个路由。

路径参数用冒号 `:` 表示。当一个路由被匹配时，它的 params 的值将在路由组件中以 `this.data.get('route.query.name')` 的形式暴露出来。因此，我们可以通过更新 BookDetail 的模板来呈现当前的书籍的 ID：

```javascript
const BookDetail = san.defineComponent({
  	template: '<div>{{route.query.name}}</div>'
})
```

如果想在 BookDetail 中的子组件中获取路由参数，那么你可以借助下面的 [withRoute](#嵌套路由) 来实现。

你可以在同一个路由中设置有多个 *路径参数*，它们会映射到 `this.data.get('route.query')` 上的相应字段。例如：

| 匹配模式                | 匹配路径       | this.data.get('route.query') |
| ----------------------- | -------------- | ---------------------------- |
| /book/:id               | /book/1        | {id: 1}                      |
| /book/:id/post/:version | /book/1/post/1 | {id: 1,version:1}            |

### 编程式导航

除了使用 `<link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。比如使用 router.push 导航到特定的路由切换视图，这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL。点击 `<link to="...">` 相当于调用 `router.push(...)` ：

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

这里的 query 会作为 query 参数添加到 url 后面，比如这里的 `/book?name=errik`。在路由组件或者通过 withRoute 包裹的组件中可以获取到这些参数。

```javascript
const BookDetail = san.defineComponent({
  	template: '<div></div>',
  	attached: function () {
				this.data.get('route').queryString === 'name=errik'
    }
})
```

### 路由懒加载

当页面足够复杂，并且具备多个路由的情况下，应用的包体积会非常大，从而增加页面加载时间，对用户体验造成非常大的影响。因此按照路由拆成多个 JavaScript 模块是非常必要的。

san 支持动态导入，因此你可以将静态导入替换成动态导入即可：
```javascript
const BookComponent = () => import('./BookComponent');
const Home = () => import('./Home');
const About = () => import('./About');

router.add([
    {
        rule: '/book/',
        Component: BookComponent,
        target: '#app'
    },
    {
        rule: '/home',
        Component: Home,
        target: '#app'
    },
        {
        rule: '/about',
        Component: About,
        target: '#app'
    }
]);
```

### 嵌套路由
一些页面的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构

```javascript
/user/home                     /user/about
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |  +------------>  | +-------------+ |
| | home         | |                  | | about       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

我们可以利用 san-router 提供的 withRoute 来实现上述的功能，withRoute 会在任意的 san 组件实例 $router 属性上挂在路由实例对象 $router，并在该组件 data 的 route 上添加路由信息；我们可以通过该路由信息获取到当前 url 对应的 query 数据，比如这里的动态路由参数 query.name。获取到 name 之后，我们可以利用 san 指令 s-is 动态地渲染 name 对应的组件。

```javascript
// 获取路由实例
import {withRoute, router, Link} from 'san-router';

// 创建 content
const Home = san.defineComponent({
    template: '<div class="content">home</div>'
});
const About = san.defineComponent({
    template: '<div class="content">about</div>'
});
const Content = withRoute(san.defineComponent({
    template: `
        <div class="abc" style="width:100px;height:100px;background-color:green">
            <div s-is="route.query.name"></div>
        </div>
    `,
    inited: function () {
        myApp = this;
        console.log(this.data.get('route'));
    },
    attached:  function () {
        console.log(this.data.get('route'));
        this.watch('route', (val) => {
            console.log(val);
        })
    },
    components: {
        'home': Home,
        'about': About
    }
}));

// 创建user组件
const User = san.defineComponent({
    template: `
        <div>
            <s-content></s-content>
        </div>
    `,
    components: {
        's-content': Content
    }
});

// 创建 App
const App = san.defineComponent({
    template: `
        <div>
            <router-link to="/user/home">click to home</router-link>
            <router-link to="/user/about">click to about</router-link>
        </div>
    `,
    components: {
        'router-link': Link
    }
});

// 添加路由
router.add([
    {
        rule: '/app',
        Component: App
    },
    {
        rule: '/user/:name',
        Component: User
    }
]);
```


### 导航守卫
#### 全局前置守卫
你可以使用 route.listen 注册全局前置守卫
```javascript
import {router} from 'san-router';
router.listen(function (/* listener 事件对象 */listenerEvent, /* 当前匹配到的路由配置 */config) {
    // 取消导航跳转
    listenerEvent.stop();
});
```

每个守卫方法接收两个参数：

- listenerEvent：路由事件对象，参考[listenerEvent](#数据接口)
- config：匹配到的配置对象

我们可以通过 listenerEvent 对象控制导航过程。

## API

### router

路由器对象。

路由用于将特定的 URL 对应到组件类上。在 URL 变化并匹配路由规则时，路由将初始化特定组件并渲染到页面上。你也可以将 URL 对应到函数上，路由将在 URL 规则匹配时执行特定函数。


#### add

`使用`

```router.add({Object|Array}options)```

`说明`

添加一条路由规则或者一组路由规则。

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
router.add([
    {
        rule: '/home',
        Component: Home,
        target: '.app-main'
    },
		{
        rule: '/about',
        Component: About,
        target: '.app-main'
    }
]);
```

Component 属性也可以用来加载一个异步的组件：

```js
const BookComponent = () => import('./BookComponent');

router.add({
    rule: '/book/:id',
    Component: BookComponent,
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

#### listen

`使用`

```router.listen({Function}listener)```

`说明`

添加路由监听器。当发生路由行为时，监听器函数被触发。

```javascript
router.listen(function (e, config) {
    e.query.id
});
```

`参数`

- `Function` listener - 监听器函数


`监听器函数参数`

- `Object` e - 路由信息对象
- `Object` config - 路由配置对象


路由监听器作为所有路由的切面函数，通常承担权限判断之类基础的任务。所以路由监听器可以通过 `stop` 方法阻断当前路由过程，并进行 URL 跳转。

```javascript
router.listen(function (e) {
    if (!checkPermission()) {
        e.stop();
        this.locator.redirect('/forbidden');
    }
});
```

路由监听器可以通过 `suspend` 和 `resume` 方法中断和唤醒路由过程，实现异步。不过异步过程会导致路由对应的视图渲染延迟，慎用。

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

#### unlisten

`使用`

```router.unlisten({Function}listener)```

`说明`

移除路由监听器。

`参数`

- `Function` listener - 监听器函数


#### setMode

`使用`

```router.setMode({String}mode)```

`说明`

设置路由模式。支持两种模式：hash | html5，默认为 hash。

`参数`

- `string` mode - 路由模式，hash | html5

#### push

`使用`

```router.push({Object}url[,{Object}options])```

`说明`

功能类似 router.locator.redict 方法，并增加了 query 对象的处理。同时在 san 组件中可通过实例的 `$router` 方法访问当前路由实例

```js
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

#### start

`使用`

```router.start()```

`说明`

启动路由


#### stop

`使用`

```router.stop()```

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

### withRoute

`使用`

```withRoute({Function|Class}component[,{Object}router])```

`说明`

为组件实例属性 `$router` 注入 `san-router` 实例，为组件实例 `data` 对象添加 `route`  [路由信息](#数据接口)数据。

`参数`

- `Function|Class ` component -  组件
- `Object` router - san-router 实例

## 数据接口

### routeConfigInfo

| 名称      | 说明                                                         | 类型              |
| --------- | ------------------------------------------------------------ | ----------------- |
| rule      | 路由规则                                                     | string            |
| Component | 路由组件                                                     | function \| class |
| target    | 需要挂载的目标 dom 或者 dom 选择器                           | string \| object  |
| handler   | 如果Component没有给定，则在路由切换的时候执行该函数；如果给定了Component，则在路由切换之后，Component 挂载之后立即执行该函数； | function          |

### listenerEvent

| 名称        | 说明                 | 类型     |
| ----------- | -------------------- | -------- |
| url         | 当前 url，比如 /home | string   |
| referrer    | 上一次 url           | string   |
| hash        | 当前 hash            | string   |
| params      | url 经过路由匹配的参数 | object   |
| query       | url 参数             | object   |
| queryString | query 字符串形式     | string   |
| config      | 配置信息             | object   |
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
