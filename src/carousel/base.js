/**
 * @ignore
 */
export default Base => class extends Base {
  /**
   * 新建Carousel实例
   */
  constructor(group = '', opts = {}) {
    super(group);

    /**
     * Carousel组件容器
     * @type {Element}
     */
    this.carousel = document.querySelector(
      `.carousel${this.group ? `[data-group="${this.group}"]` : ''}`);

    /**
     * Carousel组件banner区域
     * @type {Element}
     */
    this.main = this.carousel.querySelector('.carousel__main');

    /**
     * Carousel配置
     * @type {Object}
     * @property {number} focus - 初始聚焦页，没有上边界判断
     * @property {number} delay - 轮播延时
     * @property {number} length - 总页数
     * @property {boolean} supports - 是否支持css自定义属性
     * @desc 配置初始化后不应该被修改
     */
    this.options = Object.assign({}, {
      focus: 1,
      delay: 8000,
    }, opts, {
      length: this.main.querySelectorAll('.slide-banner').length,
      supports: (
        window.CSS && window.CSS.supports && window.CSS.supports('(--banner-translateX: 0%)')
      ),
    });

    Object.freeze(this.options);

    /**
     * 定时器
     * @type {Number}
     * @ignore
     */
    this.timeoutID = NaN;

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  /**
   * 轮播定时器
   * @param {function} cb - 延时处理函数
   * @ignore
   */
  setTimeout(cb) {
    this.timeoutID = setTimeout(cb, this.options.delay);
  }

  /**
   * 清理轮播定时器
   * @ignore
   */
  clearTimeout() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = NaN;
    }
  }

  /**
   * banner切换，若不支持css自定义变量，直接修改transform属性
   * @param {number} next - 下一页编号
   * @ignore
   */
  mainSwitch(next) {
    this.main.dataset.focus = next;

    const offset = `${(1 - next) * 100}%`;

    if (this.options.supports) {
      this.main.style.setProperty('--banner-translateX', offset);
    } else {
      this.main.style.transform = `translate3d(${offset}, 0, 0)`;
    }
  }

  /**
   * 播放
   * @param {boolean} reverse=false - 是否反向播放，反向指播放当前图片左侧的图片
   * @return {number} 下一页编号
   * @abstract
   * @ignore
   */
  play(reverse = false) {
    // 当前聚焦页
    const focus = Number(this.main.dataset.focus);

    let next = this.options.focus;
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
  pause() {
    this.clearTimeout();
  }
};
