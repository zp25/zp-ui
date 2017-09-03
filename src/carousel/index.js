import Util from '../util';
import base from './base';

/**
 * 主区域(banner)观察者
 * @param {Array.<Element>} anchors - Menu组件导航区域
 * @return {Observer}
 */
const navObserver = (navBtns) => {
  const activeName = 'slide-nav--active';

  return {
    /**
     * nav切换
     * @param {Object} state - 状态
     * @param {number} state.next - 下一页编号
     */
    update: (state) => {
      const { next } = state;

      navBtns.forEach((btn) => {
        const order = Number(btn.dataset.order);

        if (order === next) {
          btn.classList.add(activeName);
        } else {
          btn.classList.remove(activeName);
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
    /**
     * 导航区域内按钮
     * @type {Array.<Element>}
     * @private
     */
    this.navBtns = Array.from(this.nav.querySelectorAll('.slide-nav'));

    // 是否自动播放
    this.isAutoplay = false;

    // 添加导航区域observer
    this.attach(navObserver(this.navBtns));
    // 事件绑定
    this.bind();
  }

  bind() {
    this.nav.onclick = (e) => {
      e.preventDefault();

      const next = Number(e.target.dataset.order);
      if (next && next > 0 && next <= this.options.length) {
        this.combineSwitch(next);
      }
    };
  }

  /**
   * 完成切换任务
   * @param {number} next - 下一页编号
   * @private
   */
  combineSwitch(next) {
    this.clearTimeout();

    this.subject.state = {
      next,
    };

    if (this.isAutoplay) {
      this.setTimeout(this.play);
    }
  }

  /**
   * 播放指定页
   * @param {boolean} reverse - 是否反向播放，反向指播放当前图片左侧的图片
   */
  play(reverse) {
    const next = super.play(reverse);

    this.combineSwitch(next);
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
    super.pause();

    this.isAutoplay = false;
  }
}

export default Carousel;
