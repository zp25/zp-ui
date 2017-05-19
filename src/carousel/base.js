import 'babel-polyfill';

const carouselBase = Base => class extends Base {
  constructor(group = '', options = {}) {
    super(group);

    // 主要元素
    this.carousel = document.querySelector(
      `.carousel${this.group ? `[data-group="${this.group}"]` : ''}`);
    this.main = this.carousel.querySelector('.carousel__main');

    // 初始化后不应该被修改
    this.options = Object.assign({}, {
      // 初始聚焦页，没有上边界判断
      focus: 1,
      // 轮播延时
      delay: 8000,
    }, options, {
      // 总页数
      length: this.main.querySelectorAll('.slide-banner').length,
      // 是否支持css自定义属性
      supports: (
        window.CSS && window.CSS.supports && window.CSS.supports('(--banner-translateX: 0%)')
      ),
    });

    Object.freeze(this.options);

    // 定时器
    this.timeoutID = NaN;

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  /**
   * 定时器
   * @param {function} cb - 延时处理函数
   * @protected
   */
  setTimeout(cb) {
    this.timeoutID = setTimeout(cb, this.options.delay);
  }

  /**
   * 清理定时器
   * @protected
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
   * @protected
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
   * @param {boolean} [reverse=false] - 是否反向播放，反向指播放当前图片左侧的图片
   * @return {number} 下一页编号
   * @protected
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
   * @protected
   */
  pause() {
    this.clearTimeout();
  }
};

export default carouselBase;
