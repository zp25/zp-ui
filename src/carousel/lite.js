import Util from '../util';
import base from './base';

/**
 * @class
 * @description Carousel精简版，总是自动轮播。共两种操作：play总是正向播放；swipe可正反向播放，有滑动效果
 * @implements {carouselBase}
 * @implements {Util}
 */
class CarouselLite extends base(Util) {
  constructor(group = '', opts = {}) {
    super(group, opts);

    this.play = this.play.bind(this);

    this.bindListeners();
  }

  /**
   * 播放指定页，总是启动自动播放
   * @param {number} next - 下一页编号
   * @private
   */
  go(next) {
    const { length } = this.options;

    this.subject.state = {
      focus: next > 0 && next <= length ? next : 1,
    };

    this.setTimeout(this.play);
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

    if (typeof sign === 'undefined') {
      return undefined;
    }

    // 忽略动作，启动自动播放
    if (sign === 0) {
      this.setTimeout(this.play);
      return 0;
    }

    const next = sign > 0 ? this.next(true) : this.next();
    this.go(next);

    return 1;
  }

  /**
   * 自动播放下一页
   * @public
   */
  play() {
    // 总应该尝试清理存在的延时函数
    this.clearTimeout();

    this.go(this.next());
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
