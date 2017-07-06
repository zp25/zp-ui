import Util from '../util';
import carouselBase from './base';

/**
 * @class CarouselLite
 * @description Carousel精简版，仅自动轮播，无nav(包括自定义nav)
 */
class CarouselLite extends carouselBase(Util) {
  /**
   * 自动播放
   * @public
   */
  play() {
    this.clearTimeout();

    const next = super.play();
    this.mainSwitch(next);

    this.setTimeout(this.play);
  }

  /**
   * 自动播放，play的别名
   * @public
   */
  autoplay() {
    this.play();
  }

  /**
   * 暂停自动播放
   * @public
   */
  pause() {
    super.pause();
  }
}

export default CarouselLite;
