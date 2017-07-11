import Util from '../util';
import base from './base';

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

    // 主要元素
    this.nav = this.carousel.querySelector('.carousel__nav');

    // 是否自动播放
    this.isAutoplay = false;

    // 绑定事件监听
    this.nav.onclick = (e) => {
      e.preventDefault();

      const next = Number(e.target.dataset.order);
      if (next && next > 0) {
        this.combineSwitch(next);
      }
    };
  }

  /**
   * nav切换
   * @param {number} next - 下一页编号
   * @private
   */
  navSwitch(next) {
    Array.from(this.nav.querySelectorAll('.slide-nav')).forEach((item) => {
      const order = Number(item.dataset.order);

      if (order === next) {
        item.classList.add('slide-nav--active');
      } else {
        item.classList.remove('slide-nav--active');
      }
    });
  }

  /**
   * 完成切换任务
   * @param {number} next - 下一页编号
   * @private
   */
  combineSwitch(next) {
    this.clearTimeout();

    // main样式、记录修改
    this.mainSwitch(next);

    // nav样式修改
    this.navSwitch(next);

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
