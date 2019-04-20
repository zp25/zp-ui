import Carousel from './carousel';
import Swipe from './swipe';
import {
  PROP_LEN,
  PROP_FOCUS,
  PROP_DX,
  PROP_DURATION,
} from '../constants';

/**
 * 主区域(banner)观察者
 * @desc 通过修改css自定义变量改变banner聚焦页
 * @param {Element} main - Carousel组件主区域(banner)
 * @return {Observer}
 */
const bannerObserver = main => ({
  /**
   * banner切换
   * @param {Object} state - 状态
   * @param {number} state.focus - 聚焦页编号
   * @ignore
   */
  update: (state) => {
    const { focus } = state;

    main.style.setProperty(PROP_FOCUS, focus);
  },
});

/**
 * 滑动效果观察者
 * @desc 注意有特定的滑动效果和记录状态方式
 * @param {Subject} carousel - SwipeCarousel实例
 * @param {Element} main - Carousel组件主区域(banner)
 * @return {Observer}
 */
const swipeObserver = (carousel, main) => {
  const CLASS_SWIPE = 'carousel__main--swipe';

  return {
    /**
     * 开始滑动，修改样式
     * @ignore
     */
    start() {
      main.classList.add(CLASS_SWIPE);
    },

    /**
     * 滑动过程中，修改样式
     * @param {Dimention}
     * @ignore
     */
    move({
      dx,
      absDx,
      absDy,
    }) {
      if (absDx >= absDy) {
        const {
          length,
          focus,
          offsetWidth,
        } = carousel;

        let rDx = dx;

        if (Swipe.isEdge(length, focus, dx)) {
          // 计算滑动和移动比例，使边界滑动有阻力效果；方向有关
          rDx = Math.sin((dx / offsetWidth) * Math.PI * 0.5) * 0.42 * offsetWidth;
        }

        // 记录移动距离
        main.style.setProperty(PROP_DX, `${rDx}px`);
      }
    },

    /**
     * 滑动结束，修改样式，通知carousel是否播放下一页
     * @param {Dimention}
     * @return {boolean}
     * @ignore
     */
    end({
      dx,
      absDx,
      absDy,
    }) {
      const {
        length,
        focus,
        offsetWidth,
      } = carousel;

      // 重置样式
      main.classList.remove(CLASS_SWIPE);

      // 调整duration，使动画时长和剩余滑动距离关联；方向无关
      const ratio = absDx / offsetWidth;
      const duration = Swipe.isEdge(length, focus, dx) ? 1 : 1 - ratio;

      // 重置移动距离
      main.style.setProperty(PROP_DX, '0px');
      // 设置剩余时间
      main.style.setProperty(PROP_DURATION, duration);

      if (ratio < 0.1 || absDx < absDy) {
        // 不播放时，需要判断是否重启autoplay
        carousel.setAutoplay();
        return false;
      }

      // 否则播放下一页
      carousel.play(Math.sign(dx) > 0);
      return true;
    },

    /**
     * @ignore
     */
    update({
      swipe,
      x0,
      y0,
      x1,
      y1,
    }) {
      if (swipe === 'start') {
        this.start();
      } else if (swipe === 'move') {
        this.move(Swipe.dimention(x0, y0, x1, y1));
      } else if (swipe === 'end') {
        this.end(Swipe.dimention(x0, y0, x1, y1));
      }
    },
  };
};

/**
 * @class
 * @implements {Carousel}
 * @desc 为carousel添加swipe功能, 与DOM结构强关联
 */
class SwipeCarousel extends Carousel {
  constructor(group = 'main', opts = {}) {
    const query = `.carousel${group ? `[data-group="${group}"]` : ''}`;

    const slideBanner = document.querySelectorAll(`${query} .slide-banner`);
    const length = slideBanner ? slideBanner.length : 1;

    super(group, { length, ...opts });

    /**
     * Carousel组件容器
     * @type {Element}
     * @protected
     */
    this.carousel = document.querySelector(query);

    if (!this.carousel) {
      throw new Error(`can not find target ${query}`);
    }

    /**
     * Carousel组件banner区域
     * @type {Element}
     * @protected
     */
    this.main = this.carousel.querySelector('.carousel__main');

    if (!this.main) {
      throw new Error('can not find target .carousel__main');
    }

    // 初始化样式
    this.main.style.setProperty(PROP_LEN, length);

    this.attach(bannerObserver(this.main));

    this.swipe = new Swipe(group);
    this.swipe.attach(swipeObserver(this, this.main));

    this.bindListeners();
  }

  /**
   * 页面总长度
   * @type {number}
   */
  get length() {
    const { length } = this.options;

    return length;
  }

  /**
   * 容器宽，即banner宽
   * @type {number}
   */
  get offsetWidth() {
    const { offsetWidth } = this.carousel;

    return offsetWidth;
  }

  /**
   * 事件绑定
   * @private
   */
  bindListeners() {
    const {
      start,
      move,
      end,
    } = this.swipe;

    const swipeStart = start.bind(this.swipe);
    const swipeMove = move.bind(this.swipe);
    const swipeEnd = end.bind(this.swipe);

    this.main.addEventListener('mousedown', swipeStart, false);
    this.main.addEventListener('touchstart', swipeStart, false);

    this.main.addEventListener('mousemove', swipeMove, false);
    this.main.addEventListener('touchmove', swipeMove, false);

    this.main.addEventListener('mouseup', swipeEnd, false);
    this.main.addEventListener('touchend', swipeEnd, false);

    this.main.addEventListener('mouseleave', swipeEnd, false);
  }
}

export default SwipeCarousel;
export {
  bannerObserver,
  swipeObserver,
};
