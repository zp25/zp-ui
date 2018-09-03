# UI工具

[![npm](https://img.shields.io/npm/v/zp-ui.svg)](https://www.npmjs.com/package/zp-ui)
[![Build Status](https://travis-ci.org/zp25/zp-ui.svg?branch=master)](https://travis-ci.org/zp25/zp-ui)

主要目录结构

+ constants，常量
+ legacy，尝试IE9+
+ src
  + carousel
  + group，通用类，示例见example分支的menu
  + imageLoader
  + modal
  + util
+ styles
  + _func.scss
  + _root.scss

默认颜色通过css custom properties设置。legacy需自定义`$colorMap`，例如

~~~scss
$colorMap: (
  black: #222,
  border: #ccc,
);
~~~

若`black, white, grey, blue, green, red`未定义使用默认颜色

## Observer
使用观察者模式管理状态切换

自定义观察者(observer)必须包含`update`方法，接收被观察者(subject)的当前状态和原状态。使用Subject实例方法`attach(), detach()`管理观察者，参数接收`(Observer|Array.<Observer>)`。

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
浏览器支持情况

~~~
last 1 version
> 0.5%
not dead
~~~
.browserslistrc配置

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
+ [Simple Swipe With Vanilla JavaScript](https://css-tricks.com/simple-swipe-with-vanilla-javascript/ "Simple Swipe With Vanilla JavaScript")
+ [The Rise Of The State Machines](https://www.smashingmagazine.com/2018/01/rise-state-machines/ "The Rise Of The State Machines")
