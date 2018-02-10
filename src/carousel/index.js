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
 * @description 新建Carousel实例，可自定义nav
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

    // 是否自动播放
    this.isAutoplay = false;

    // 添加导航区域observer
    this.attach(navObserver(this.nav));
    // 事件绑定
    this.bind();
  }

  bind() {
    this.nav.onclick = (e) => {
      e.preventDefault();

      const next = Number(e.target.dataset.order);
      if (next && next >= 1 && next <= this.options.length) {
        this.go(next);
      }
    };
  }

  /**
   * 播放指定页，若autoplay启动延时函数
   * @param {number} next - 下一页编号
   * @private
   */
  go(next) {
    this.clearTimeout();

    this.subject.state = {
      focus: next,
    };

    if (this.isAutoplay) {
      this.setTimeout(this.play);
    }
  }

  /**
   * 播放下一页
   * @param {boolean} reverse - 是否反向播放，反向指播放当前图片左侧的图片
   */
  play(reverse) {
    const next = super.play(reverse);

    this.go(next);
  }

  /**
   * 自动播放，总是正向播放
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
    this.isAutoplay = false;

    this.clearTimeout();
  }
}

export default Carousel;
