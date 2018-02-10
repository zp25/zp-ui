import Util from '../util';
import base from './base';

/**
 * @class
 * @description Carousel精简版，仅自动轮播，无nav(包括自定义nav)
 * @implements {carouselBase}
 * @implements {Util}
 */
class CarouselLite extends base(Util) {
  /**
   * 自动播放
   */
  play() {
    this.clearTimeout();

    const next = super.play();
    this.subject.state = {
      focus: next,
    };

    this.setTimeout(this.play);
  }

  /**
   * 暂停自动播放
   * @public
   */
  pause() {
    this.clearTimeout();
  }
}

export default CarouselLite;
