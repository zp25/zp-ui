/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }] */

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
      main.style.setProperty('--banner-focus', focus);
    } else {
      const offset = `${(1 - focus) * 100}%`;
      main.style.transform = `translate3d(${offset}, 0, 0)`;
    }
  },
});

export default Base => /** @class CarouselBase */ class extends Base {
  /**
   * 统一定位时使用的对象
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(MouseEvent|Touch)}
   * @private
   */
  static unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

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

    /**
     * Carousel内部状态，可变
     * @type {Object}
     * @property {(number|undefined)} timeoutID - 自动播放定时器
     * @property {boolean} lock - 是否在滑动操作中
     * @property {(number|undefined)} x0 - swipe起始x坐标
     * @property {(number|undefined)} y0 - swipe起始y坐标
     * @protected
     */
    this.state = {
      offsetWidth: this.offsetWidth,
      timeoutID: undefined,
      lock: false,
      x0: undefined,
      y0: undefined,
    };

    // 添加主区域(banner)observer
    this.attach(bannerObserver(this.main, this.options.supports));

    this.swipeStart = this.swipeStart.bind(this);
    this.swipeMove = this.swipeMove.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
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

    // 初始化样式
    if (this._options.supports) {
      this.main.style.setProperty('--banner-length', this._options.length);
    }
  }

  /**
   * 当前聚焦页
   * @type {(number|undefined)}
   * @memberOf CarouselBase
   * @instance
   * @protected
   */
  get focus() {
    return this.subject.state.focus;
  }

  /**
   * 获取容器宽
   * @return {number} 容器宽
   * @private
   */
  get offsetWidth() {
    return this.carousel.offsetWidth;
  }

  /**
   * 是否在边缘页且正在向空白部分滑动
   * @param {number} dx - 水平方向移动距离
   * @return {boolean}
   * @private
   */
  isEdge(dx) {
    const { length } = this.options;

    return (this.focus === 1 && dx > 0) || (this.focus === length && dx < 0);
  }

  /**
   * 事件绑定
   * @memberOf CarouselBase
   * @instance
   * @protected
   */
  bindListeners() {
    this.main.addEventListener('mousedown', this.swipeStart, false);
    this.main.addEventListener('touchstart', this.swipeStart, false);

    this.main.addEventListener('mousemove', this.swipeMove, false);
    this.main.addEventListener('touchmove', this.swipeMove, false);

    this.main.addEventListener('mouseup', this.swipeEnd, false);
    this.main.addEventListener('touchend', this.swipeEnd, false);

    // 追踪容器宽
    window.addEventListener('resize', () => {
      this.state = Object.assign({}, this.state, {
        offsetWidth: this.offsetWidth,
      });
    });
  }

  /**
   * 滑动动作开始
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @memberOf CarouselBase
   * @instance
   * @protected
   */
  swipeStart(e) {
    const {
      clientX: x0,
      clientY: y0,
    } = this.constructor.unify(e);

    this.state = Object.assign({}, this.state, {
      lock: true,
      x0,
      y0,
    });

    this.main.classList.add('carousel__main--swipe');
  }

  /**
   * 滑动动作，水平夹角45deg内有效
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @protected
   * @ignore
   */
  swipeMove(e) {
    const {
      offsetWidth,
      lock,
      x0,
      y0,
    } = this.state;

    if (lock) {
      const {
        clientX: x1,
        clientY: y1,
      } = this.constructor.unify(e);

      const dx = x1 - x0;
      const [absDx, absDy] = [Math.abs(dx), Math.abs(y1 - y0)];

      if (absDx >= absDy) {
        let bannerDx = dx;

        if (this.isEdge(dx)) {
          // 计算滑动和移动比例，使边界滑动有阻力效果；方向有关
          const ratio = (dx / offsetWidth).toFixed(2);
          bannerDx = Math.sin(ratio * Math.PI * 0.5) * 0.42 * offsetWidth;
        }

        this.main.style.setProperty('--banner-dx', `${bannerDx}px`);
      }
    }
  }

  /**
   * 滑动动作结束
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(number|undefined)} 0滑动距离小于阈值或滑动水平夹角小于45deg，忽略动作；-1向左滑动作；1向右滑动作；undefined无动作
   * @memberOf CarouselBase
   * @instance
   * @abstract
   */
  swipeEnd(e) {
    const {
      offsetWidth,
      lock,
      x0,
      y0,
    } = this.state;

    if (lock) {
      this.state = Object.assign({}, this.state, {
        lock: false,
        x0: undefined,
        y0: undefined,
      });

      this.main.classList.remove('carousel__main--swipe');
      this.main.style.setProperty('--banner-dx', '0px');

      // 定位
      const {
        clientX: x1,
        clientY: y1,
      } = this.constructor.unify(e);

      const dx = x1 - x0;
      const [absDx, absDy] = [Math.abs(dx), Math.abs(y1 - y0)];

      // 调整duration，使动画时长和剩余滑动距离关联；方向无关
      const ratio = (absDx / offsetWidth).toFixed(2);
      const duration = this.isEdge(dx) ? 1 : 1 - ratio;

      this.main.style.setProperty('--banner-duration', duration);

      return (ratio < 0.1 || absDx < absDy) ? 0 : Math.sign(dx);
    }

    return undefined;
  }

  /**
   * 轮播定时器
   * @param {function} cb - 延时处理函数
   * @protected
   * @ignore
   */
  setTimeout(cb) {
    const timeoutID = setTimeout(cb, this.options.delay);

    this.state.timeoutID = timeoutID;
  }

  /**
   * 清理轮播定时器
   * @protected
   * @ignore
   */
  clearTimeout() {
    const { timeoutID } = this.state;

    if (typeof timeoutID === 'number') {
      clearTimeout(timeoutID);
      this.state.timeoutID = undefined;
    }
  }

  /**
   * 获取下一播放页编号；若首次运行(this.focus空)，聚焦到this.options.focus
   * @param {boolean} reverse=false - 是否反向播放，反向指播放页编号比当前页小1
   * @return {number} 下一页编号
   * @protected
   * @ignore
   */
  next(reverse = false) {
    const {
      focus,
      length: len,
    } = this.options;

    let result = focus;

    if (this.focus) {
      if (reverse) {
        result = this.focus <= 1 ? len : this.focus - 1;
      } else {
        result = this.focus >= len ? 1 : this.focus + 1;
      }
    }

    return result;
  }
};
