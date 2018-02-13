# UI工具

[![Build Status](https://travis-ci.org/zp25/zp-ui.svg?branch=master)](https://travis-ci.org/zp25/zp-ui)

目录结构

~~~
+-- constants
+-- legacy
|   +-- carousel.js
+-- src
|   +-- carousel
|   |   +-- base.js
|   |   +-- index.js
|   |   +-- lite.js
|   +-- imageLoader.js
|   +-- mask.js
|   +-- menu.js
|   +-- subject.js
|   +-- util.js
+-- styles
|   +-- legacy
|   |   +-- _carousel.scss
|   |   +-- _func.scss
|   |   +-- _root.scss
|   +-- _btn.scss
|   +-- _carousel.scss
|   +-- _func.scss
|   +-- _imageLoader.scss
|   +-- _mask.scss
|   +-- _panel.scss
|   +-- _root.scss
+-- index.js
+-- legacy.js
~~~

src, styles组件源码，legacy支持gte IE9，styles/legacy支持gte IE8

`_func.scss, _root.scss`是依赖，需自定义`$colorMap`，例如

~~~scss
$colorMap: (
  black: #222,
  border: #ccc,
);
~~~

若`black, white, grey, blue, green, red`未定义使用默认颜色

## Observer
使用观察者模式管理状态切换

自定义观察者(observer)必须包含`update`方法，接收被观察者(subject)的当前状态和原状态。使用组件的实例方法`attach(), detach()`管理观察者，参数接收`(Observer|Array.<Observer>)`。

~~~javascript
const customObserver = () => ({
  update: (state, prevState) => {
    const { page: currentPage } = state;
    const { page: prevPage } = prevState;

    if (prevPage !== currentPage && currentPage === 'main') {
      doSth();
    }
  },
});

const menu = new Menu('main');
menu.attach(customObserver());
~~~
menu添加自定义观察者示例。当menu状态切换到打开main页时将执行`doSth`函数。

## browserslist
browserslist配置

~~~json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "Firefox ESR",
    "chrome >= 43",
    "safari >= 8",
    "ios >= 8",
    "not ie < 11"
  ]
}
~~~
浏览器支持情况

## 测试和文档
测试和文档

~~~bash
npm test
~~~
运行单元测试

~~~bash
npm run jsdoc

# darwin
npm run open
~~~
生成和查看doc

## 资源
+ [How to Build Your Own Progressive Image Loader](https://www.sitepoint.com/how-to-build-your-own-progressive-image-loader/ "How to Build Your Own Progressive Image Loader")
+ [How Medium does progressive image loading](https://jmperezperez.com/medium-image-progressive-loading-placeholder/ "How Medium does progressive image loading")
+ [SpinKit](http://tobiasahlin.com/spinkit/ "SpinKit")
