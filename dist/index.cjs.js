'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@babel/polyfill/lib/core-js/modules/es6.array.from');
require('@babel/polyfill/lib/core-js/modules/es6.object.assign');
require('@babel/polyfill/lib/core-js/modules/es7.array.includes');
require('@babel/polyfill/lib/core-js/modules/es6.string.includes');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return _get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/* eslint no-underscore-dangle:0 */

/**
 * @typedef {Object} Observer
 * @property {Function} update - 更新状态
 */

/**
 * @class
 * @description 被观察者
 */
var Subject =
/*#__PURE__*/
function () {
  function Subject() {
    _classCallCheck(this, Subject);

    /**
     * 观察者序列
     * @type {Array.<Observer>}
     * @public
     */
    this.observers = [];
    /**
     * 被观察者状态
     * @type {Object}
     * @private
     */

    this._state = null;
  }
  /**
   * 绑定观察者
   * @param {Observer} observer - 观察者对象
   * @public
   */


  _createClass(Subject, [{
    key: "attach",
    value: function attach(observer) {
      if (!this.observers.includes(observer)) {
        this.observers = this.observers.concat(observer);
      }
    }
    /**
     * 解绑观察者
     * @param {Observer} observer - 观察者对象
     * @public
     */

  }, {
    key: "detach",
    value: function detach(observer) {
      this.observers = this.observers.filter(function (o) {
        return o !== observer;
      });
    }
    /**
     * 获取状态
     * @return {Object}
     * @public
     */

  }, {
    key: "notify",

    /**
     * 通知观察者状态变化
     * @param {Object} prevState - 原状态
     * @private
     */
    value: function notify(prevState) {
      var _this = this;

      this.observers.forEach(function (o) {
        if ({}.hasOwnProperty.call(o, 'update')) {
          o.update(_this.state, prevState);
        }
      });
    }
  }, {
    key: "state",
    get: function get() {
      return Object.assign({}, this._state);
    }
    /**
     * 更新状态
     * @param {Object} newState - 更新状态
     * @public
     */
    ,
    set: function set(newState) {
      var prevState = Object.assign({}, this._state);
      this._state = Object.assign({}, prevState, newState);
      this.notify(prevState);
    }
  }]);
  return Subject;
}();

/**
 * @interface Util
 */

var Util =
/*#__PURE__*/
function () {
  function Util(group) {
    _classCallCheck(this, Util);

    /**
     * 实例分类，用于单页多实例间区分
     * @type string
     */
    this.group = group;
    /**
     * 被观察者实例
     * @type {Subject}
     */

    this.subject = new Subject();
  }
  /**
   * 查找最近父元素或当前元素
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill}
   * @param {Element} el - 子元素
   * @param {string} parent - 父元素选择器
   * @return {(Element|null)} 查找到的元素，无匹配返回null
   */


  _createClass(Util, [{
    key: "attach",

    /**
     * 为subject绑定observer
     * @param {(Observer|Array.<Observer>)} observer - 观察者对象
     * @return {number} 已绑定observer数量
     */
    value: function attach(observer) {
      var _this = this;

      var iterable = Array.isArray(observer) ? observer : [observer];
      iterable.forEach(function (o) {
        _this.subject.attach(o);
      });
      return this.subject.observers.length;
    }
    /**
     * 为subject移除observer
     * @param {(Observer|Array.<Observer>)} observer - 观察者对象
     * @return {number} 已绑定observer数量
     */

  }, {
    key: "detach",
    value: function detach(observer) {
      var _this2 = this;

      var iterable = Array.isArray(observer) ? observer : [observer];
      iterable.forEach(function (o) {
        _this2.subject.detach(o);
      });
      return this.subject.observers.length;
    }
  }], [{
    key: "closest",
    value: function closest(el, parent) {
      if (typeof el.closest === 'function') {
        return el.closest(parent);
      }

      var matches = Array.from((el.document || el.ownerDocument).querySelectorAll(parent));
      var node = el;
      var matchedArr = [];

      var cb = function cb(m) {
        return node === m;
      };

      do {
        matchedArr = matches.filter(cb);
      } while (matchedArr.length === 0 && (node = node.parentElement));

      return node;
    }
    /**
     * escape HTML
     * @see {@link https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406}
     * @param {string} unsafe - 需转义字符串
     * @return {string} 转义后字符串
     */

  }, {
    key: "escapeHtml",
    value: function escapeHtml(unsafe) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return unsafe.replace(/[&<>"']/g, function (m) {
        return map[m];
      });
    }
  }]);
  return Util;
}();

/**
 * 主区域(banner)观察者
 * @param {Element} main - Carousel组件主区域(banner)
 * @param {boolean} cssCustomProp - 浏览器环境是否支持css自定义参数
 * @return {Observer}
 */
var bannerObserver = function bannerObserver(main, cssCustomProp) {
  return {
    /**
     * banner切换，若不支持css自定义变量，直接修改transform属性
     * @param {Object} state - 状态
     * @param {number} state.next - 下一页编号
     */
    update: function update(state) {
      var next = state.next;
      var offset = "".concat((1 - next) * 100, "%");
      main.dataset.focus = next;

      if (cssCustomProp) {
        main.style.setProperty('--banner-translateX', offset);
      } else {
        main.style.transform = "translate3d(".concat(offset, ", 0, 0)");
      }
    }
  };
};
/**
 * @ignore
 */


var base = (function (Base) {
  return (
    /*#__PURE__*/
    function (_Base) {
      _inherits(_class, _Base);

      /**
       * 新建Carousel实例
       */
      function _class() {
        var _this;

        var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        _classCallCheck(this, _class);
        _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, group));
        var query = ".carousel".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
        /**
         * Carousel组件容器
         * @type {Element}
         * @public
         */

        _this.carousel = document.querySelector(query);
        /**
         * Carousel组件banner区域
         * @type {Element}
         * @private
         */

        _this.main = _this.carousel.querySelector('.carousel__main');
        /**
         * Carousel配置
         * @type {Object}
         * @property {number} focus - 初始聚焦页，没有上边界判断
         * @property {number} delay - 轮播延时
         * @property {number} length - 总页数
         * @property {boolean} supports - 是否支持css自定义属性
         * @desc 配置初始化后不应该被修改
         */

        _this.options = Object.assign({}, {
          focus: 1,
          delay: 8000
        }, opts, {
          length: _this.main.querySelectorAll('.slide-banner').length,
          supports: window.CSS && window.CSS.supports && window.CSS.supports('(--banner-translateX: 0%)')
        });
        Object.freeze(_this.options);
        /**
         * 定时器
         * @type {Number}
         * @ignore
         */

        _this.timeoutID = NaN;
        _this.play = _this.play.bind(_this);
        _this.pause = _this.pause.bind(_this); // 添加主区域(banner)observer

        _this.attach(bannerObserver(_this.main, _this.options.supports));

        return _this;
      }
      /**
       * 轮播定时器
       * @param {function} cb - 延时处理函数
       * @ignore
       */


      _createClass(_class, [{
        key: "setTimeout",
        value: function (_setTimeout) {
          function setTimeout(_x) {
            return _setTimeout.apply(this, arguments);
          }

          setTimeout.toString = function () {
            return _setTimeout.toString();
          };

          return setTimeout;
        }(function (cb) {
          this.timeoutID = setTimeout(cb, this.options.delay);
        })
        /**
         * 清理轮播定时器
         * @ignore
         */

      }, {
        key: "clearTimeout",
        value: function (_clearTimeout) {
          function clearTimeout() {
            return _clearTimeout.apply(this, arguments);
          }

          clearTimeout.toString = function () {
            return _clearTimeout.toString();
          };

          return clearTimeout;
        }(function () {
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = NaN;
          }
        })
        /**
         * 播放
         * @param {boolean} reverse=false - 是否反向播放，反向指播放当前图片左侧的图片
         * @return {number} 下一页编号
         * @abstract
         * @ignore
         */

      }, {
        key: "play",
        value: function play() {
          var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          // 当前聚焦页
          var focus = Number(this.main.dataset.focus);
          var next = this.options.focus;

          if (focus > 0) {
            if (reverse) {
              next = focus === 1 ? this.options.length : focus - 1;
            } else {
              next = focus >= this.options.length ? 1 : focus + 1;
            }
          }

          return next;
        }
        /**
         * 暂停轮播
         * @abstract
         * @ignore
         */

      }, {
        key: "pause",
        value: function pause() {
          this.clearTimeout();
        }
      }]);
      return _class;
    }(Base)
  );
});

/**
 * 主区域(banner)观察者
 * @param {Array.<Element>} anchors - Menu组件导航区域
 * @return {Observer}
 */

var navObserver = function navObserver(navBtns) {
  var activeName = 'slide-nav--active';
  return {
    /**
     * nav切换
     * @param {Object} state - 状态
     * @param {number} state.next - 下一页编号
     */
    update: function update(state) {
      var next = state.next;
      navBtns.forEach(function (btn) {
        var order = Number(btn.dataset.order);

        if (order === next) {
          btn.classList.add(activeName);
        } else {
          btn.classList.remove(activeName);
        }
      });
    }
  };
};
/**
 * @class
 * @description 新建Carousel实例，可自定义nav
 * @implements {carouselBase}
 * @implements {Util}
 */


var Carousel =
/*#__PURE__*/
function (_base) {
  _inherits(Carousel, _base);

  /**
   * @param {string} group='' - 组件分类
   * @param {Object} opts={} - Carousel配置
   * @param {number} [opts.focus=1] - 初始聚焦页，没有上边界判断
   * @param {number} [opts.delay=8000] - 轮播延时(ms)
   * @augments {carouselBase}
   */
  function Carousel() {
    var _this;

    var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Carousel);
    _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, group, opts));
    /**
     * 导航区域
     * @type {Element}
     * @public
     */

    _this.nav = _this.carousel.querySelector('.carousel__nav');
    /**
     * 导航区域内按钮
     * @type {Array.<Element>}
     * @private
     */

    _this.navBtns = Array.from(_this.nav.querySelectorAll('.slide-nav')); // 是否自动播放

    _this.isAutoplay = false; // 添加导航区域observer

    _this.attach(navObserver(_this.navBtns)); // 事件绑定


    _this.bind();

    return _this;
  }

  _createClass(Carousel, [{
    key: "bind",
    value: function bind() {
      var _this2 = this;

      this.nav.onclick = function (e) {
        e.preventDefault();
        var next = Number(e.target.dataset.order);

        if (next && next > 0 && next <= _this2.options.length) {
          _this2.combineSwitch(next);
        }
      };
    }
    /**
     * 完成切换任务
     * @param {number} next - 下一页编号
     * @private
     */

  }, {
    key: "combineSwitch",
    value: function combineSwitch(next) {
      this.clearTimeout();
      this.subject.state = {
        next: next
      };

      if (this.isAutoplay) {
        this.setTimeout(this.play);
      }
    }
    /**
     * 播放指定页
     * @param {boolean} reverse - 是否反向播放，反向指播放当前图片左侧的图片
     */

  }, {
    key: "play",
    value: function play(reverse) {
      var next = _get(Carousel.prototype.__proto__ || Object.getPrototypeOf(Carousel.prototype), "play", this).call(this, reverse);
      this.combineSwitch(next);
    }
    /**
     * 自动播放，总是正向播放
     */

  }, {
    key: "autoplay",
    value: function autoplay() {
      this.isAutoplay = true; // 播放初始聚焦页

      this.play();
    }
    /**
     * 暂停自动播放
     */

  }, {
    key: "pause",
    value: function pause() {
      _get(Carousel.prototype.__proto__ || Object.getPrototypeOf(Carousel.prototype), "pause", this).call(this);
      this.isAutoplay = false;
    }
  }]);
  return Carousel;
}(base(Util));

/**
 * @class
 * @description Carousel精简版，仅自动轮播，无nav(包括自定义nav)
 * @implements {carouselBase}
 * @implements {Util}
 * @param {string} group='' - 组件分类
 * @param {Object} opts={} - Carousel配置
 * @param {number} [opts.focus=1] - 初始聚焦页，没有上边界判断
 * @param {number} [opts.delay=8000] - 轮播延时(ms)
 */

var CarouselLite =
/*#__PURE__*/
function (_base) {
  _inherits(CarouselLite, _base);

  function CarouselLite() {
    _classCallCheck(this, CarouselLite);
    return _possibleConstructorReturn(this, (CarouselLite.__proto__ || Object.getPrototypeOf(CarouselLite)).apply(this, arguments));
  }

  _createClass(CarouselLite, [{
    key: "play",

    /**
     * 自动播放
     */
    value: function play() {
      this.clearTimeout();
      var next = _get(CarouselLite.prototype.__proto__ || Object.getPrototypeOf(CarouselLite.prototype), "play", this).call(this);
      this.subject.state = {
        next: next
      };
      this.setTimeout(this.play);
    }
    /**
     * 暂停自动播放
     */

  }, {
    key: "pause",
    value: function pause() {
      _get(CarouselLite.prototype.__proto__ || Object.getPrototypeOf(CarouselLite.prototype), "pause", this).call(this);
    }
  }]);
  return CarouselLite;
}(base(Util));

/**
 * mask观察者
 * @param {Element} mask - mask对象
 * @return {Observer}
 */

var maskObserver = function maskObserver(mask) {
  var activeName = 'mask--active';
  return {
    /**
     * mask样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     */
    update: function update(state) {
      if (state.hidden) {
        mask.classList.remove(activeName);
      } else {
        mask.classList.add(activeName);
      }
    }
  };
};
/**
 * panel观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */


var panelObserver = function panelObserver(panels) {
  var activeName = 'mask__panel--active';
  return {
    /**
     * penel样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     * @param {string} state.panel - 当期聚焦页
     */
    update: function update(state) {
      var hidden = state.hidden,
          panel = state.panel;
      var panelName = "mask__panel--".concat(panel);
      panels.forEach(function (p) {
        if (hidden || !p.classList.contains(panelName)) {
          p.classList.remove(activeName);
        } else {
          p.classList.add(activeName);
        }
      });
    }
  };
};
/**
 * 提示信息观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */


var messageObserver = function messageObserver(panels) {
  return {
    /**
     * 写入提示信息
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     * @param {string} state.panel - 当期聚焦页
     * @param {string} state.message - 提示信息
     * @throws {Error} 不存在匹配元素.mask__penel--{name}
     */
    update: function update(state) {
      var hidden = state.hidden,
          panel = state.panel,
          message = state.message;
      var panelName = "mask__panel--".concat(panel);
      var target = panels.filter(function (p) {
        return p.classList.contains(panelName);
      });

      if (!hidden) {
        // 提供提示
        if (target.length === 0) {
          throw new Error("".concat(panelName, " not exists"));
        }

        target[0].querySelector('.panel__body .message').innerHTML = message;
      }
    }
  };
};
/**
 * @class
 * @implements {Util}
 */


var Mask =
/*#__PURE__*/
function (_Util) {
  _inherits(Mask, _Util);

  /**
   * 新建Mask实例
   * @param {string} [group] - 组件分类，区别单页中多个Mask组件，若单页仅一个Mask可忽略
   * @augments {Util}
   */
  function Mask(group) {
    var _this;

    _classCallCheck(this, Mask);
    _this = _possibleConstructorReturn(this, (Mask.__proto__ || Object.getPrototypeOf(Mask)).call(this, group));
    var query = ".mask".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
    /**
     * Mask组件容器
     * @type {Element}
     * @public
     */

    _this.mask = document.querySelector(query);
    /**
     * Mask组件panel区域
     * @type {Array.<Element>}
     * @private
     */

    _this.panels = Array.from(_this.mask.querySelectorAll('.mask__panel')); // 添加默认observer

    _this.attach(maskObserver(_this.mask));

    _this.attach(panelObserver(_this.panels));

    _this.attach(messageObserver(_this.panels));

    return _this;
  }
  /**
   * 提示信息
   * @param {string} name - panel名称，将查找.mask__penel--{name}
   * @param {string} [msg] - 提示信息
   */


  _createClass(Mask, [{
    key: "prompt",
    value: function prompt(name) {
      var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      this.subject.state = {
        hidden: false,
        panel: name,
        message: this.constructor.escapeHtml(msg)
      };
    }
    /**
     * loading效果
     * @param {string} [msg] - 提示信息
     */

  }, {
    key: "loading",
    value: function loading() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.prompt('loading', msg);
    }
    /**
     * 隐藏Mask
     */

  }, {
    key: "hide",
    value: function hide() {
      this.subject.state = {
        hidden: true,
        panel: '',
        message: ''
      };
    }
  }]);
  return Mask;
}(Util);

/**
 * 导航区域观察者
 * @param {Array.<Element>} anchors - Menu组件导航区域
 * @return {Observer}
 */

var anchorsObserver = function anchorsObserver(anchors) {
  var activeName = 'menu__anchor--active';
  return {
    /**
     * 导航区域样式切换
     * @param {Object} state - 状态
     * @param {string} state.page - 当期聚焦页
     */
    update: function update(state) {
      var currentPage = state.page;
      anchors.forEach(function (anchor) {
        var page = anchor.dataset.page;

        if (page === currentPage) {
          anchor.classList.add(activeName);
        } else {
          anchor.classList.remove(activeName);
        }
      });
    }
  };
};
/**
 * @class
 * @implements {Util}
 */


var Menu =
/*#__PURE__*/
function (_Util) {
  _inherits(Menu, _Util);

  /**
   * 新建Menu实例
   * @param {string} [group] - 组件分类，区别单页中多个Menu组件，若单页仅一个Menu可忽略
   * @augments {Util}
   */
  function Menu(group) {
    var _this;

    _classCallCheck(this, Menu);
    _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, group));
    var query = ".menu".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
    /**
     * Menu组件容器
     * @type {Element}
     * @public
     */

    _this.menu = document.querySelector(query);
    /**
     * Menu组件导航区域
     * @type {Array.<Element>}
     * @private
     */

    _this.anchors = Array.from(_this.menu.querySelectorAll('.menu__anchor')); // 添加默认observer

    _this.attach(anchorsObserver(_this.anchors)); // 事件绑定


    _this.bind();

    return _this;
  }
  /**
   * 事件绑定
   * @private
   */


  _createClass(Menu, [{
    key: "bind",
    value: function bind() {
      var _this2 = this;

      this.anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          // 状态存储导航按键的dataset
          _this2.subject.state = e.currentTarget.dataset;
          e.preventDefault();
        }, false);
      });
    }
    /**
     * 打开指定页，通过点击匹配menu__anchor实现
     * @param {(number|string)} [id] - 页面id，未设置或无匹配menu__anchor将点击Menu容器中第一个menu__anchor
     */

  }, {
    key: "open",
    value: function open(id) {
      var target = this.anchors.filter(function (anchor) {
        return anchor.dataset.page === String(id);
      })[0] || this.anchors[0];
      target.click();
    }
  }]);
  return Menu;
}(Util);

exports.Carousel = Carousel;
exports.CarouselLite = CarouselLite;
exports.Mask = Mask;
exports.Menu = Menu;
//# sourceMappingURL=index.cjs.js.map
