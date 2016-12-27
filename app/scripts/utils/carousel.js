import 'babel-polyfill';

/**
 * Carousel超类
 * @param {string} group   轮播组
 * @param {Object} options 配置
 */
function carouselBase(group, options = {}) {
  const focus = options.focus || 1;
  const delay = options.delay || 8000;

  // 组
  this.group = group || '';

  // 主要元素
  this.carousel = $(`.carousel${group ? `[data-group="${group}"]` : ''}`);
  this.main = this.carousel.children('.carousel__main');

  // 初始聚焦页，不要修改，没有上边界判断
  this.focus = (typeof focus === 'number' || focus instanceof Number) && focus > 0
    ? focus : 1;

  // 轮播延时
  this.delay = delay;

  // 定时器
  this.timeoutID = NaN;
}

/**
 * 设置定时器，延时执行play
 */
carouselBase.prototype.setTimeout = function carouselSetTimeout() {
  this.timeoutID = setTimeout(() => {
    this.play();
  }, this.delay);
};

/**
 * 清理定时器
 */
carouselBase.prototype.clearTimeout = function carouselClearTimeout() {
  if (this.timeoutID) {
    clearTimeout(this.timeoutID);
    this.timeoutID = NaN;
  }
};

/**
 * 播放指定页
 * @param {boolean} reverse 是否反向播放，反向指播放当前图片左侧的图片
 * @return {number} 将播放页
 */
carouselBase.prototype.play = function play(reverse = false) {
  const len = this.main.children('.slide-pannel').length;
  const focus = this.main.data('focus');

  let next = this.focus;
  if (focus) {
    if (reverse) {
      next = focus === 1 ? len : focus - 1;
    } else {
      next = focus >= len ? 1 : focus + 1;
    }
  }

  return next;
};

carouselBase.prototype.pause = function pause() {
  this.clearTimeout();
};

/**
 * 轮播模块
 * @param {string} group   轮播组
 * @param {Object} options 配置
 */
function Carousel(group, options = {}) {
  carouselBase.call(this, group, options);

  // 主要元素
  this.nav = this.carousel.children('.carousel__nav');

  // 是否自动播放
  this.isAutoplay = false;

  this.bind();
}

Carousel.prototype = Object.create(carouselBase.prototype);
Carousel.prototype.constructor = Carousel;

/**
 * 为导航绑定事件监听
 */
Carousel.prototype.bind = function bind() {
  const that = this;

  this.nav.children('.slide-nav').each(function each() {
    $(this).on('click', (e) => {
      e.preventDefault();

      const target = $(e.currentTarget);
      that.handle(target);
    });
  });
};

/**
 * 导航回调
 * @param {Object} e 事件对象
 */
Carousel.prototype.handle = function handle(target) {
  this.clearTimeout();

  const order = Number(target.data('order'));
  const offset = `${(1 - order) * 100}%`;

  // main
  this.main.data('focus', order)
    .animate({ left: offset }, 500);

  // nav
  this.nav.children('.slide-nav')
    .removeClass('slide-nav--active')
    .filter(target).addClass('slide-nav--active');

  if (this.isAutoplay) {
    this.setTimeout();
  }
};

/**
 * 播放指定页
 * @param {boolean} reverse 是否反向播放，反向指播放当前图片左侧的图片
 */
Carousel.prototype.play = function play(reverse) {
  const next = Object.getPrototypeOf(Carousel.prototype).play.call(this, reverse);

  this.nav.find(
    `.slide-nav[data-order="${next}"] .slide-nav__anchor`).click();
};

/**
 * 自动播放，总是正向播放，正向指播放当前图片右侧的图片
 */
Carousel.prototype.autoplay = function autoplay() {
  this.isAutoplay = true;

  // 播放初始聚焦页
  this.play();
};

/**
 * 暂停自动播放
 */
Carousel.prototype.pause = function pause() {
  Object.getPrototypeOf(Carousel.prototype).pause.call(this);

  this.isAutoplay = false;
};

/**
 * 精简轮播模块
 * @param {string} group   轮播组
 * @param {Object} options 配置
 */
function CarouselLite(group, options = {}) {
  carouselBase.call(this, group, options);
}

CarouselLite.prototype = Object.create(carouselBase.prototype);
CarouselLite.prototype.constructor = CarouselLite;

/**
 * 自动播放
 */
CarouselLite.prototype.play = function play() {
  this.clearTimeout();

  const next = Object.getPrototypeOf(CarouselLite.prototype).play.call(this);
  const offset = `${(1 - next) * 100}%`;

  this.main.data('focus', next)
    .animate({ left: offset }, 500);

  this.setTimeout();
};

/**
 * 自动播放，play的别名
 */
CarouselLite.prototype.autoplay = function autoplay() {
  this.play();
};

export { Carousel, CarouselLite };
