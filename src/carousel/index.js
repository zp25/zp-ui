import Util from '../util';
import base from './base';

/**
 * 导航区域(nav)观察者
 * @param {Element} nav - Menu组件导航区域
 * @return {Observer}
 */
const navObserver = (nav) => {
  const btnActiveName = 'slide-nav--active';

  return {
    /**
     * nav样式切换
     * @param {Object} state - 状态
     * @param {number} state.focus - 聚焦页编号
     * @ignore
     */
    update: (state) => {
      const { focus } = state;

      Array.from(nav.querySelectorAll('.slide-nav')).forEach((btn) => {
        const order = Number(btn.dataset.order);

        if (order === focus) {
          btn.classList.add(btnActiveName);
        } else {
          btn.classList.remove(btnActiveName);
        }
      });
    },
  };
};

/**
 * @class
 * @description 新建Carousel实例，可自定义nav。共3种操作：自动轮播和自定义nav，总是连续播放；swipe有滑动效果；播放指定页
 * @implements {carouselBase}
 * @implements {Util}
 */
class Carousel extends base(Util) {
  /**
   * @param {string} group='' - 组件分类
   * @param {Object} opts={} - Carousel配置
   * @param {number} [opts.focus=1] - 初始聚焦页，没有上边界判断
   * @param {number} [opts.delay=8000] - 轮播延时(ms)
   * @augments {carouselBase}
   */
  constructor(group = '', opts = {}) {
    super(group, opts);

    /**
     * 导航区域
     * @type {Element}
     * @public
     */
    this.nav = this.carousel.querySelector('.carousel__nav');

    // 添加是否自动播放状态
    this.state = Object.assign({}, this.state, { isAutoplay: false });

    // 添加导航区域observer
    this.attach(navObserver(this.nav));

    this.play = this.play.bind(this);

    // 事件绑定
    this.bindListeners();
  }

  /**
   * 事件绑定
   * @private
   */
  bindListeners() {
    super.bindListeners();

    this.nav.onclick = (e) => {
      e.preventDefault();

      const next = Number(e.target.dataset.order);
      this.play(next);
    };
  }

  /**
   * 播放指定页，若autoplay启动自动播放
   * @param {number} next - 下一页编号
   * @private
   */
  go(next) {
    const { length } = this.options;
    const { isAutoplay } = this.state;

    this.subject.state = {
      focus: next > 0 && next <= length ? next : 1,
    };

    if (isAutoplay) {
      this.setTimeout(this.play);
    }
  }

  /**
   * 滑动动作开始
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @private
   */
  swipeStart(e) {
    super.swipeStart(e);

    // 总应该尝试清理存在的延时函数
    this.clearTimeout();
  }

  /**
   * 滑动动作结束
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(number|undefined)} 完成状态，0不播放，1播放，undefined无动作
   * @private
   */
  swipeEnd(e) {
    const sign = super.swipeEnd(e);
    const { isAutoplay } = this.state;

    if (typeof sign === 'undefined') {
      return undefined;
    }

    // 忽略动作，启动自动播放
    if (sign === 0) {
      if (isAutoplay) {
        this.setTimeout(this.play);
      }

      return 0;
    }

    const next = sign > 0 ? this.next(true) : this.next();
    this.go(next);

    return 1;
  }

  /**
   * 播放下一页
   * @param {(boolean|number)} reverse - 是否反向播放，若number将播放指定页
   * @public
   */
  play(reverse = false) {
    // 总应该尝试清理存在的延时函数
    this.clearTimeout();

    if (typeof reverse === 'number') {
      this.go(reverse);
    } else {
      this.go(this.next(reverse));
    }
  }

  /**
   * 自动播放下一页
   * @public
   */
  autoplay() {
    this.isAutoplay = true;

    // 播放初始聚焦页
    this.play();
  }

  /**
   * 暂停自动播放
   * @public
   */
  pause() {
    this.isAutoplay = false;

    this.clearTimeout();
  }
}

export default Carousel;
