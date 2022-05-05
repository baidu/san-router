"use strict";(self.webpackChunksan_router=self.webpackChunksan_router||[]).push([[118],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>c});var l=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,l,r=function(e,t){if(null==e)return{};var n,l,r={},i=Object.keys(e);for(l=0;l<i.length;l++)n=i[l],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(l=0;l<i.length;l++)n=i[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=l.createContext({}),u=function(e){var t=l.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=u(e.components);return l.createElement(p.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},d=l.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),d=u(n),c=r,m=d["".concat(p,".").concat(c)]||d[c]||k[c]||i;return n?l.createElement(m,a(a({ref:t},s),{},{components:n})):l.createElement(m,a({ref:t},s))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=d;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,a[1]=o;for(var u=2;u<i;u++)a[u]=n[u];return l.createElement.apply(null,a)}return l.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3880:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>p,default:()=>c,frontMatter:()=>o,metadata:()=>u,toc:()=>k});var l=n(7462),r=n(3366),i=(n(7294),n(3905)),a=["components"],o={id:"api",sidebar_label:"API",slug:"/api",title:"API"},p=void 0,u={unversionedId:"api",id:"api",title:"API",description:"router",source:"@site/website/docs/api.md",sourceDirName:".",slug:"/api",permalink:"/san-router/docs/api",draft:!1,editUrl:"https://github.com/baidu/san-router/blob/master/website/docs/api.md",tags:[],version:"current",frontMatter:{id:"api",sidebar_label:"API",slug:"/api",title:"API"},sidebar:"guide",previous:{title:"\u5bfc\u822a\u5b88\u536b",permalink:"/san-router/docs/guide/navigation-guards"},next:{title:"\u6570\u636e\u7ed3\u6784",permalink:"/san-router/docs/data-structure"}},s={},k=[{value:"router",id:"router",level:2},{value:"add",id:"add",level:3},{value:"listen",id:"listen",level:3},{value:"unlisten",id:"unlisten",level:3},{value:"setMode",id:"setmode",level:3},{value:"push",id:"push",level:3},{value:"start",id:"start",level:3},{value:"stop",id:"stop",level:3},{value:"Link",id:"link",level:2},{value:"withRoute",id:"withroute",level:2}],d={toc:k};function c(e){var t=e.components,n=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,l.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"router"},"router"),(0,i.kt)("p",null,"\u8def\u7531\u5668\u5bf9\u8c61\u3002"),(0,i.kt)("p",null,"\u8def\u7531\u5668\u7528\u4e8e\u5c06\u7279\u5b9a\u7684 URL \u5339\u914d\u5230\u5bf9\u5e94\u7684\u7ec4\u4ef6\u7c7b\u4e0a\u3002\u5728 URL \u53d8\u5316\u5e76\u5339\u914d\u5230\u5177\u4f53\u7684\u8def\u7531\u89c4\u5219\u65f6\uff0c\u8def\u7531\u5c06\u521d\u59cb\u5316\u5bf9\u5e94\u7684\u7ec4\u4ef6\u5e76\u6e32\u67d3\u5230\u9875\u9762\u4e0a\u3002\u4f60\u4e5f\u53ef\u4ee5\u5c06 URL \u6620\u5c04\u5230\u7279\u5b9a\u7684\u51fd\u6570\u4e0a\uff0c\u8def\u7531\u5c06\u5728 URL \u5339\u914d\u5230\u5bf9\u5e94\u89c4\u5219\u65f6\u6267\u884c\u8be5\u51fd\u6570\u3002"),(0,i.kt)("h3",{id:"add"},"add"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.add({Object|Array}options)")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u6dfb\u52a0\u4e00\u6761\u8def\u7531\u89c4\u5219\u6216\u8005\u4e00\u7ec4\u8def\u7531\u89c4\u5219\u3002"),(0,i.kt)("p",null,"\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"string|RegExp")," options.rule - \u8def\u7531\u89c4\u5219"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Function")," options.Component - \u89c4\u5219\u5339\u914d\u65f6\u6e32\u67d3\u7684\u7ec4\u4ef6\u7c7b"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"string")," options.target - \u7ec4\u4ef6\u6e32\u67d3\u7684\u5bb9\u5668\u5143\u7d20\uff0c\u9ed8\u8ba4\u503c\u4e3a ",(0,i.kt)("strong",{parentName:"li"},"#main")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Function")," options.handler - \u89c4\u5219\u5339\u914d\u65f6\u7684\u6267\u884c\u7684\u51fd\u6570")),(0,i.kt)("h3",{id:"listen"},"listen"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.listen({Function}listener)")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u6dfb\u52a0\u8def\u7531\u76d1\u542c\u51fd\u6570\uff0c\u5f53\u8def\u7531\u53d1\u751f\u53d8\u5316\u65f6\uff0c\u76d1\u542c\u51fd\u6570\u4f1a\u88ab\u89e6\u53d1\u3002"),(0,i.kt)("p",null,"\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Function")," listener - \u76d1\u542c\u5668\u51fd\u6570")),(0,i.kt)("p",null,"\u76d1\u542c\u5668\u51fd\u6570\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Object")," e - \u8def\u7531\u4fe1\u606f\u5bf9\u8c61"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Object")," config - \u8def\u7531\u914d\u7f6e\u5bf9\u8c61")),(0,i.kt)("h3",{id:"unlisten"},"unlisten"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.unlisten({Function}listener)")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u79fb\u9664\u8def\u7531\u76d1\u542c\u51fd\u6570\u3002"),(0,i.kt)("p",null,"\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Function")," listener - \u76d1\u542c\u5668\u51fd\u6570")),(0,i.kt)("h3",{id:"setmode"},"setMode"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.setMode({String}mode)")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u8bbe\u7f6e\u8def\u7531\u6a21\u5f0f\u3002\u652f\u6301 ",(0,i.kt)("inlineCode",{parentName:"p"},"hash")," \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"html5")," \u4e24\u79cd\u8def\u7531\u6a21\u5f0f\uff0c\u9ed8\u8ba4\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"hash"),"\u3002"),(0,i.kt)("p",null,"\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"string")," mode - \u8def\u7531\u6a21\u5f0f\uff0c",(0,i.kt)("inlineCode",{parentName:"li"},"hash")," \u6216 ",(0,i.kt)("inlineCode",{parentName:"li"},"html5"))),(0,i.kt)("h3",{id:"push"},"push"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.push({Object}url[,{Object}options])")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u529f\u80fd\u7c7b\u4f3c ",(0,i.kt)("inlineCode",{parentName:"p"},"router.locator.redict")," \u65b9\u6cd5\uff0c\u5e76\u589e\u52a0\u4e86\u5bf9 query \u5bf9\u8c61\u7684\u5904\u7406\u3002\u540c\u65f6\u5728 san \u7ec4\u4ef6\u4e2d\u53ef\u901a\u8fc7\u5b9e\u4f8b\u7684 ",(0,i.kt)("inlineCode",{parentName:"p"},"$router")," \u5bf9\u8c61\u8bbf\u95ee\u5f53\u524d\u8def\u7531\u5b9e\u4f8b\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"router.push({\n    query: {\n        name: 'erik',\n        sex: 1,\n        age: 18\n    }\n});\n\n// san \u7ec4\u4ef6\u4e2d\nthis.$router.push({\n    query: {\n        name: 'erik',\n        sex: 1,\n        age: 18\n    }\n});\n")),(0,i.kt)("h3",{id:"start"},"start"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.start()")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u7528\u4e8e\u542f\u52a8\u8def\u7531\u3002"),(0,i.kt)("h3",{id:"stop"},"stop"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"router.stop()")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u7528\u4e8e\u505c\u6b62\u8def\u7531\u3002"),(0,i.kt)("h2",{id:"link"},"Link"),(0,i.kt)("p",null,"\u5177\u6709\u8def\u7531\u529f\u80fd\u7684\u5e94\u7528\u4e2d\uff0c\u5efa\u8bae\u4f7f\u7528 ",(0,i.kt)("inlineCode",{parentName:"p"},"Link")," \u7ec4\u4ef6\u4ee3\u66ff a \u6807\u7b7e\u3002",(0,i.kt)("inlineCode",{parentName:"p"},"Link")," \u7ec4\u4ef6\u53ef\u4ee5\u6839\u636e\u8def\u7531\u6a21\u5f0f\u6e32\u67d3\u4e00\u4e2a\u94fe\u63a5\u3002\u901a\u8fc7 ",(0,i.kt)("inlineCode",{parentName:"p"},"to")," \u5c5e\u6027\u6307\u5b9a\u76ee\u6807\u5730\u5740\uff0c\u4ece\u800c\u8ba9 ",(0,i.kt)("inlineCode",{parentName:"p"},"Link")," \u7ec4\u4ef6\u53ef\u4ee5\u6e32\u67d3\u4e00\u4e2a\u5e26\u6709\u6b63\u786e\u5730\u5740\u7684 a \u6807\u7b7e\u3002"),(0,i.kt)("h2",{id:"withroute"},"withRoute"),(0,i.kt)("p",null,"\u4f7f\u7528\uff1a"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"withRoute({Function|Class}component[,{Object}router])")),(0,i.kt)("p",null,"\u8bf4\u660e\uff1a"),(0,i.kt)("p",null,"\u4e3a\u7ec4\u4ef6\u5b9e\u4f8b\u6dfb\u52a0\u540d\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"$router")," \u7684 ",(0,i.kt)("inlineCode",{parentName:"p"},"san-router")," \u5b9e\u4f8b\uff0c\u4e3a\u7ec4\u4ef6\u5b9e\u4f8b ",(0,i.kt)("inlineCode",{parentName:"p"},"data")," \u5bf9\u8c61\u6dfb\u52a0 ",(0,i.kt)("inlineCode",{parentName:"p"},"route"),"  ",(0,i.kt)("a",{parentName:"p",href:"/san-router/docs/data-structure#routeInfo"},"\u8def\u7531\u4fe1\u606f"),"\u6570\u636e\u3002"),(0,i.kt)("p",null,"\u53c2\u6570\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Function|Class ")," component -  \u7ec4\u4ef6"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Object")," router - san-router \u5b9e\u4f8b")))}c.isMDXComponent=!0}}]);