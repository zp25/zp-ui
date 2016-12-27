import 'babel-polyfill';
import Util from './util';

const carouselBase = Base => class extends Base {
  constructor(group = '', options = {}) {
    super(group);

    const { focus, delay } = Object.assign({}, {
      focus: 1,
      delay: 8000,
    }, options);

    // 主要元素
    this.carousel = document.querySelector(
      `.carousel${this.group ? `[data-group="${this.group}"]` : ''}`);
    this.main = this.carousel.querySelector('.carousel__main');

    // 初始聚焦页，没有上边界判断
    this.focus = Number.isInteger(focus) && focus > 0 ? focus : 1;

    // 轮播延时
    this.delay = delay;

    // 定时器
    this.timeoutID = NaN;
  }

  /**
   * 设置定时器，延时执行play
   */
  setTimeout() {
    this.timeoutID = setTimeout(() => {
      this.play();
    }, this.delay);
  }

  /**
   * 清理定时器
   */
  clearTimeout() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = NaN;
    }
  }

  /**
   * 播放指定页
   * @param {Boolean} reverse 是否反向播放，反向指播放当前图片左侧的图片
   * @return {Number} 将播放页
   */
  play(reverse = false) {
    // 读取轮播页数和当前聚焦页
    const len = this.main.querySelectorAll('.slide-pannel').length;
    const focus = Number(this.main.dataset.focus);

    let next = this.focus;
    if (focus) {
      if (reverse) {
        next = focus === 1 ? len : focus - 1;
      } else {
        next = focus >= len ? 1 : focus + 1;
      }
    }

    return next;
  }

  /**
   * 暂停轮播
   */
  pause() {
    this.clearTimeout();
  }
};

class Carousel extends carouselBase(Util) {
  constructor(group, options = {}) {
    super(group, options);

    // 主要元素
    this.nav = this.carousel.querySelector('.carousel__nav');

    // 是否自动播放
    this.isAutoplay = false;

    // 绑定事件监听
    this.bind();
  }

  /**
   * 为导航绑定事件监听
   */
  bind() {
    Array.from(this.nav.querySelectorAll('.slide-nav')).forEach((item) => {
      item.onclick = (e) => {
        e.preventDefault();

        const target = e.currentTarget;
        this.handle(target);
      };
    });
  }

  /**
   * 导航回调
   * @param {Object} e 事件对象
   */
  handle(target) {
    this.clearTimeout();

    const order = target.dataset.order;

    // main，存储信息，存入聚焦页
    this.main.dataset.focus = order;

    // nav，控制，修改样式
    Array.from(this.nav.querySelectorAll('.slide-nav')).forEach((item) => {
      if (target === item) {
        item.classList.add('slide-nav--active');
      } else {
        item.classList.remove('slide-nav--active');
      }
    });

    if (this.isAutoplay) {
      this.setTimeout();
    }
  }

  /**
   * 播放指定页
   * @param {Boolean} reverse 是否反向播放，反向指播放当前图片左侧的图片
   */
  play(reverse) {
    const next = super.play(reverse);

    this.nav.querySelector(
      `.slide-nav[data-order="${next}"] .slide-nav__anchor`).click();
  }

  /**
   * 自动播放，总是正向播放，正向指播放当前图片右侧的图片
   */
  autoplay() {
    this.isAutoplay = true;

    // 播放初始聚焦页
    this.play();
  }

  /**
   * 暂停自动播放
   */
  pause() {
    super.pause();

    this.isAutoplay = false;
  }
}

class CarouselLite extends carouselBase(Util) {
  constructor(group, options = {}) {
    super(group, options);
  }

  /**
   * 自动播放
   */
  play() {
    this.clearTimeout();

    const next = super.play();
    this.main.dataset.focus = next;

    // 轮播
    this.setTimeout();
  }

  /**
   * 自动播放，play的别名
   */
  autoplay() {
    this.play();
  }
}

export { Carousel, CarouselLite };
