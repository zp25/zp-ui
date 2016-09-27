import 'babel-polyfill';
import Util from './util';

const bannerBase = Base => class extends Base {
  constructor(group = '', options = {}) {
    super();

    const { focus, delay } = Object.assign({}, {
      focus: 1,
      delay: 8000,
    }, options);

    // 组
    this.group = group;

    // 主要元素
    this.banner = document.querySelector(
      `.banner${this.group ? `[data-group="${this.group}"]` : ''}`
    );
    this.main = this.banner.querySelector('.banner__main');

    // 初始聚焦页，不要修改，没有上边界判断
    if (typeof focus === 'number' || focus instanceof Number) {
      this.focus = focus > 0 ? focus : 1;
    } else {
      this.focus = 1;
    }

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
   * @return {number} 将播放页
   */
  play() {
    // main，存储信息，读取轮播页数和聚焦页
    const len = this.main.querySelectorAll('.slide_pannel').length;
    const focus = Number(this.main.dataset.focus);

    let next = this.focus;
    if (focus) {
      next = focus >= len ? 1 : focus + 1;
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

class Banner extends bannerBase(Util) {
  constructor(group, options = {}) {
    super(group, options);

    // 主要元素
    this.nav = this.banner.querySelector('.banner__nav');

    // 是否自动播放
    this.isAutoplay = false;

    // 绑定事件监听
    this.bind();
  }

  /**
   * 为导航绑定事件监听
   */
  bind() {
    Array.from(this.nav.querySelectorAll('.slide_nav')).forEach((list) => {
      list.onclick = (e) => {
        e.preventDefault();

        this.handle(e);
      };
    });
  }

  /**
   * 导航回调
   * @param {Object} e 事件对象
   */
  handle(e) {
    this.clearTimeout();

    const order = e.currentTarget.dataset.order;

    // main，存储信息，存入聚焦页
    this.main.dataset.focus = order;

    // nav，控制，修改样式
    Array.from(this.nav.querySelectorAll('.slide_nav__anchor'))
      .forEach((anchor) => {
        if (e.target === anchor) {
          anchor.classList.add('slide_nav__anchor--focus');
        } else {
          anchor.classList.remove('slide_nav__anchor--focus');
        }
      });

    if (this.isAutoplay) {
      this.setTimeout();
    }
  }

  /**
   * 播放指定页
   */
  play() {
    const next = super.play();

    this.nav.querySelector(
      `.slide_nav[data-order="${next}"] .slide_nav__anchor`).click();
  }

  /**
   * 自动播放
   */
  autoplay() {
    this.isAutoplay = true;

    // 播放初始聚焦页
    this.play();
  }

  /**
   * 暂停轮播
   */
  pause() {
    super.pause();

    this.isAutoplay = false;
  }
}

class BannerLite extends bannerBase(Util) {
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

export { Banner, BannerLite };
