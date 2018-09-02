/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }] */

/**
 * @typedef {Object} Position
 * @property {number} clientX
 * @property {number} clientY
 */

/**
 * @typedef {Object} Dimention
 * @property {number} dx - x轴方向移动距离
 * @property {number} dy - y轴方向移动距离
 * @property {number} absDx - x轴方向移动距离绝对值
 * @property {number} absDy - y轴方向移动距离绝对值
 */

import { machine } from 'zp-lib';
import Util from './util';
import {
  PROP_LEN,
  PROP_FOCUS,
  PROP_DX,
  PROP_DURATION,
} from '../constants';

const CLASS_SWIPE = 'carousel__main--swipe';

/**
 * 主区域(banner)观察者
 * @param {Element} main - Carousel组件主区域(banner)
 * @param {boolean} cssCustomProp - 浏览器环境是否支持css自定义参数
 * @return {Observer}
 */
const bannerObserver = (main, cssCustomProp) => ({
  /**
   * banner切换，若不支持css自定义变量，直接修改transform属性
   * @param {Object} state - 状态
   * @param {number} state.focus - 聚焦页编号
   * @ignore
   */
  update: (state) => {
    const { focus } = state;

    if (cssCustomProp) {
      main.style.setProperty(PROP_FOCUS, focus);
    } else {
      const offset = `${(1 - focus) * 100}%`;
      main.style.transform = `translate3d(${offset}, 0, 0)`;
    }
  },
});

/**
 * 滑动动作状态查询字典
 * @type {Object}
 * @ignore
 */
const SwipeDict = {
  start: {
    SWIPEMOVE: 'move',
    SWIPEEND: 'end',
  },
  move: {
    SWIPEMOVE: 'move',
    SWIPEEND: 'end',
  },
  end: {
    SWIPESTART: 'start',
  },
};

/**
 * @class
 * @implements {Util}
 */
class Carousel extends Util {
  /**
   * 统一定位时使用的对象
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(MouseEvent|Touch)}
   * @private
   */
  static unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  /**
   * 获取尺寸信息
   * @return {Dimention} 尺寸信息
   * @private
   */
  static dimention(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    return {
      dx,
      dy,
      absDx: Math.abs(dx),
      absDy: Math.abs(dy),
    };
  }

  /**
   * 是否在边缘页且正在向空白部分滑动
   * @param {number} length - 总页数
   * @param {number} focus - 当前聚焦页编号
   * @param {number} dx - 水平方向移动距离
   * @return {boolean}
   * @private
   */
  static isEdge(length, focus, dx) {
    return (focus === 1 && dx > 0) || (focus === length && dx < 0);
  }

  /**
   * Carousel内部状态，可变
   * @type {Object}
   * @property {boolean} isAutoplay - 是否自动播放状态
   * @property {string} swipe - swipe当前状态
   * @property {number} x0 - swipe起始x坐标
   * @property {number} y0 - swipe起始y坐标
   * @private
   */
  state = {
    isAutoplay: false,
    swipe: 'end',
    x0: 0,
    y0: 0,
  };

  /**
   * 自动播放定时器
   * @type {Number}
   * @private
   */
  timeoutID = NaN;

  /**
   * 新建Carousel实例
   * @param {string} [group] - 组件分类，区别单页中多个Carousel组件，若单页仅一个Carousel可忽略
   * @param {Object} opts - 自定义配置
   * @augments {Util}
   */
  constructor(group = '', opts = {}) {
    super(group);

    const query = `.carousel${this.group ? `[data-group="${this.group}"]` : ''}`;
    /**
     * Carousel组件容器
     * @type {Element}
     * @protected
     */
    this.carousel = document.querySelector(query);
    /**
     * Carousel组件banner区域
     * @type {Element}
     * @protected
     */
    this.main = this.carousel.querySelector('.carousel__main');

    // setter
    this.options = opts;

    const { supports, length } = this.options;

    // 初始化样式
    if (supports) {
      this.main.style.setProperty(PROP_LEN, length);
    }

    // 添加主区域(banner)observer
    this.attach(bannerObserver(this.main, supports));
    // 添加状态机
    this.machine = machine(SwipeDict);

    this.dispatch = this.dispatch.bind(this);
    this.play = this.play.bind(this);

    // 事件绑定
    this.bindListeners();
  }

  /**
   * Carousel配置，不可变
   * @type {Object}
   * @property {number} length - 总页数
   * @property {number} focus - 初始聚焦页，没有上边界判断
   * @property {number} delay - 轮播延时
   * @property {boolean} supports - 是否支持css自定义属性
   * @desc 配置初始化后不应该被修改
   * @memberOf CarouselBase
   * @instance
   * @public
   */
  get options() {
    return this._options;
  }

  /**
   * 设置Carousel配置
   * @param {Object} opts - 自定义配置
   * @private
   */
  set options(opts) {
    const slideBanner = this.main.querySelectorAll('.slide-banner');

    this._options = Object.assign({}, {
      length: slideBanner ? slideBanner.length : 1,
      focus: 1,
      delay: 8000,
    }, opts, {
      supports: (
        window.CSS && window.CSS.supports && window.CSS.supports('(--banner-focus: 1)')
      ),
    });

    Object.freeze(this._options);
  }

  /**
   * 当前聚焦页
   * @type {(number|undefined)}
   * @protected
   */
  get focus() {
    return this.subject.state.focus;
  }

  /**
   * 容器宽，即banner宽
   * @type {number}
   * @protected
   */
  get offsetWidth() {
    return this.carousel.offsetWidth;
  }

  /**
   * 事件绑定
   * @private
   */
  bindListeners() {
    this.main.addEventListener('mousedown', this.dispatch('SWIPESTART'), false);
    this.main.addEventListener('touchstart', this.dispatch('SWIPESTART'), false);

    this.main.addEventListener('mousemove', this.dispatch('SWIPEMOVE'), false);
    this.main.addEventListener('touchmove', this.dispatch('SWIPEMOVE'), false);

    this.main.addEventListener('mouseup', this.dispatch('SWIPEEND'), false);
    this.main.addEventListener('touchend', this.dispatch('SWIPEEND'), false);
  }

  /**
   * 事件调度
   * @description 绑定fsm和对象实例，依照fsm信息完成匹配动作
   * @param {string} action - fsm输入
   * @return {Function}
   * @private
   */
  dispatch(action) {
    /**
     * @param {(MouseEvent|TouchEvent)} e - 事件对象
     * @ignore
     */
    return (e) => {
      const {
        clientX,
        clientY,
      } = this.constructor.unify(e);
      const pos = {
        clientX,
        clientY,
      };

      const { swipe: currentState } = this.state;
      const nextState = this.machine(currentState)(action);

      if (nextState === 'start') {
        this.swipeStart(pos);
      } else if (nextState === 'move') {
        this.swipeMove(pos);
      } else if (nextState === 'end') {
        this.swipeEnd(pos);
      }
    };
  }

  /**
   * 滑动动作开始
   * @description 清理自动播放，更新状态，修改样式
   * @param {Position} pos - 位置信息
   * @protected
   * @ignore
   */
  swipeStart(pos) {
    // 总应该尝试清理旧的自动播放
    this.clearAutoplay();

    const {
      clientX: x0,
      clientY: y0,
    } = pos;

    this.setState({
      swipe: 'start',
      x0,
      y0,
    });
    this.main.classList.add(CLASS_SWIPE);
  }

  /**
   * 滑动动作，水平夹角45deg内(含45deg)有效
   * @param {Position} pos - 位置信息
   * @return {(number|undefined)} 若滑动有效，返回水平轴滑动距离，否则返回undefined
   * @protected
   * @ignore
   */
  swipeMove(pos) {
    const { x0, y0 } = this.state;
    const {
      clientX: x1,
      clientY: y1,
    } = pos;
    const {
      dx,
      absDx,
      absDy,
    } = this.constructor.dimention(x0, y0, x1, y1);

    this.setState({ swipe: 'move' });

    if (absDx >= absDy) {
      const { length } = this.options;
      let rDx = dx;

      if (this.constructor.isEdge(length, this.focus, dx)) {
        // 计算滑动和移动比例，使边界滑动有阻力效果；方向有关
        rDx = Math.sin((dx / this.offsetWidth) * Math.PI * 0.5) * 0.42 * this.offsetWidth;
      }

      // 记录移动距离
      this.main.style.setProperty(PROP_DX, `${rDx}px`);
      return rDx;
    }

    return undefined;
  }

  /**
   * 滑动动作结束，水平夹角45deg内(含45deg)有效，有总宽度0.1的滑动阈值
   * @param {Position} pos - 位置信息
   * @return {(number|undefined)} 完成状态，0不播放，1播放，undefined无动作
   * @protected
   * @ignore
   */
  swipeEnd(pos) {
    const { x0, y0 } = this.state;
    const {
      clientX: x1,
      clientY: y1,
    } = pos;

    this.setState({
      swipe: 'end',
      x0: 0,
      y0: 0,
    });
    this.main.classList.remove(CLASS_SWIPE);

    const {
      dx,
      absDx,
      absDy,
    } = this.constructor.dimention(x0, y0, x1, y1);
    const { length } = this.options;

    // 调整duration，使动画时长和剩余滑动距离关联；方向无关
    const ratio = absDx / this.offsetWidth;
    const duration = this.constructor.isEdge(length, this.focus, dx) ? 1 : 1 - ratio;

    // 重置移动距离
    this.main.style.setProperty(PROP_DX, '0px');
    // 设置剩余时间
    this.main.style.setProperty(PROP_DURATION, duration);

    if (ratio < 0.1 || absDx < absDy) {
      // 不播放时，需要判断是否重启autoplay
      this.setAutoplay();

      return 0;
    }

    const next = Math.sign(dx) > 0 ? this.next(true) : this.next();
    this.go(next);

    return 1;
  }

  /**
   * 初始化自动播放
   * @protected
   * @ignore
   */
  setAutoplay() {
    const { isAutoplay } = this.state;

    if (isAutoplay) {
      const { delay } = this.options;
      this.timeoutID = setTimeout(this.play, delay);
    }
  }

  /**
   * 清理自动播放
   * @protected
   * @ignore
   */
  clearAutoplay() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = NaN;
    }
  }

  /**
   * 播放指定页，尝试启动自动播放
   * @description play和swipe共同入口
   * @param {number} next - 下一页编号
   * @protected
   * @ignore
   */
  go(next) {
    const {
      focus: initFocus,
      length,
    } = this.options;

    this.subject.state = {
      focus: next > 0 && next <= length ? next : initFocus,
    };

    this.setAutoplay();
  }

  /**
   * 获取下一播放页编号，若首次运行(this.focus空)，聚焦到this.options.focus
   * @param {boolean} reverse=false - 是否反向播放，反向指播放页编号比当前页小1
   * @return {number} 下一页编号
   * @protected
   * @ignore
   */
  next(reverse = false) {
    const {
      focus: initFocus,
      length,
    } = this.options;

    let result = initFocus;

    if (this.focus) {
      if (reverse) {
        result = this.focus <= 1 ? length : this.focus - 1;
      } else {
        result = this.focus >= length ? 1 : this.focus + 1;
      }
    }

    return result;
  }

  /**
   * 播放下一页
   * @param {(boolean|number)} reverse - 是否反向播放，若number将播放指定页
   * @public
   */
  play(reverse = false) {
    // 总应该尝试清理旧的自动播放
    this.clearAutoplay();

    if (typeof reverse === 'boolean') {
      this.go(this.next(reverse));
    } else {
      this.go(reverse);
    }
  }

  /**
   * 开启自动播放，并播放下一页
   * @public
   */
  autoplay() {
    this.setState({ isAutoplay: true });
    this.play();
  }

  /**
   * 暂停自动播放
   * @public
   */
  pause() {
    this.setState({ isAutoplay: false });
    this.clearAutoplay();
  }
}

export default Carousel;
