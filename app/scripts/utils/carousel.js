/* eslint no-unused-vars:1 */

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
  if (typeof focus === 'number' || focus instanceof Number) {
    this.focus = focus > 0 ? focus : 1;
  } else {
    this.focus = 1;
  }

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
 * @return {number} 将播放页
 */
carouselBase.prototype.play = function play() {
  const len = this.main.children('.slide_pannel').length;
  const focus = Number(this.main.data('focus'));

  let next = this.focus;
  if (focus) {
    next = focus >= len ? 1 : focus + 1;
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

  this.nav.children('.slide_nav').each(function each() {
    $(this).on('click', (e) => {
      e.preventDefault();

      that.handle(e);
    });
  });
};

/**
 * 导航回调
 * @param {Object} e 事件对象
 */
Carousel.prototype.handle = function handle(e) {
  this.clearTimeout();

  const order = Number($(e.currentTarget).data('order'));
  const offset = `${(1 - order) * 100}%`;

  // main
  this.main.data('focus', order)
    .animate({ left: offset }, 500);

  // nav
  this.nav.find('.slide_nav__anchor')
    .removeClass('slide_nav__anchor--focus')
    .filter(e.target).addClass('slide_nav__anchor--focus');

  if (this.isAutoplay) {
    this.setTimeout();
  }
};

/**
 * 启动定时器，播放下一张图
 * @return {number} 定时器ID
 */
Carousel.prototype.play = function play() {
  const next = Object.getPrototypeOf(Carousel.prototype).play.call(this);

  this.nav.find(
    `.slide_nav[data-order="${next}"] .slide_nav__anchor`).click();
};

/**
 * 自动播放
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
