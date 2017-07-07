# UI工具

目录结构

~~~
+-- legacy
|   +-- carousel.js
+-- src
|   +-- carousel
|   |   +-- base.js
|   |   +-- index.js
|   |   +-- lite.js
|   +-- mask.js
|   +-- menu.js
|   +-- util.js
+-- styles
|   +-- _btn.scss
|   +-- _carousel.legacy.scss
|   +-- _carousel.scss
|   +-- _func.scss
|   +-- _global.scss
|   +-- _mask.scss
|   +-- _menu.scss
|   +-- _panel.scss
|   +-- _root.scss
+-- index.js
~~~

src, styles组件源码，legacy支持gte IE8

`_func.scss, _global.scss, _root.scss`是依赖，需自定义`$colorMap`，例如

~~~
$colorMap: (
  black-hole: #010101,
  grey-light: #ddd,
  grey-bg: #f5f5f5,
  border: #ccc,
);
~~~

若`black, white, grey, blue, green, red`未定义使用默认颜色

# 资源
+ [How to Build Your Own Progressive Image Loader](https://www.sitepoint.com/how-to-build-your-own-progressive-image-loader/ "How to Build Your Own Progressive Image Loader")
+ [How Medium does progressive image loading](https://jmperezperez.com/medium-image-progressive-loading-placeholder/ "How Medium does progressive image loading")
+ [SpinKit](http://tobiasahlin.com/spinkit/ "SpinKit")
