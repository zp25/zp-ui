import Util from '../util';
import base from './base';
import {
  PROP_DX,
  PROP_DURATION,
} from '../../constants';

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
   * 滑动动作
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   */
  swipeMove(e) {
    const move = super.swipeMove(e);

    if (typeof move === 'number') {
      this.main.style.setProperty(PROP_DX, `${move}px`);
    }
  }

  /**
   * 滑动动作结束，设置动画效果，完成页面切换
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(number|undefined)} 完成状态，0不播放，1播放，undefined无动作
   * @private
   */
  swipeEnd(e) {
    const end = super.swipeEnd(e);

    if (typeof end === 'undefined') {
      return undefined;
    }

    // 重置swipeMove记录
    this.main.style.setProperty(PROP_DX, '0px');

    // 忽略动作，启动自动播放
    if (end === 0) {
      this.setTimeout(this.play);
      return 0;
    }

    const { sign, duration } = end;

    this.main.style.setProperty(PROP_DURATION, duration);

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
