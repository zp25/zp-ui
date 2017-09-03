import Util from '../util';
import base from './base';

/**
 * @class
 * @description Carousel精简版，仅自动轮播，无nav(包括自定义nav)
 * @implements {carouselBase}
 * @implements {Util}
 * @param {string} group='' - 组件分类
 * @param {Object} opts={} - Carousel配置
 * @param {number} [opts.focus=1] - 初始聚焦页，没有上边界判断
 * @param {number} [opts.delay=8000] - 轮播延时(ms)
 */
class CarouselLite extends base(Util) {
  /**
   * 自动播放
   */
  play() {
    this.clearTimeout();

    const next = super.play();
    this.subject.state = {
      next,
    };

    this.setTimeout(this.play);
  }

  /**
   * 暂停自动播放
   */
  pause() {
    super.pause();
  }
}

export default CarouselLite;
