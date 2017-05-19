/**
 * carouselBase
 * @param {string} group - 轮播组
 * @param {Object} options - 配置
 * @constructor
 */
function carouselBase(group, options = {}) {
  const focus = Number(options.focus) || 1;
  const delay = options.delay || 8000;

  // 组
  this.group = group || '';

  // 主要元素
  this.carousel = $(`.carousel${group ? `[data-group="${group}"]` : ''}`);
  this.main = this.carousel.children('.carousel__main');

  // 初始聚焦页，没有上边界判断
  this.options = {
    // 初始聚焦页，没有上边界判断
    focus,
    // 轮播延时
    delay,
    // 总页数
    length: this.main.children('.slide-banner').length,
  };

  // 定时器
  this.timeoutID = NaN;
}

/**
 * 定时器
 * @param {function} cb - 延时处理函数
 * @protected
 */
carouselBase.prototype.setTimeout = function carouselSetTimeout(cb) {
  this.timeoutID = setTimeout(cb, this.options.delay);
};

/**
 * 清理定时器
 * @protected
 */
carouselBase.prototype.clearTimeout = function carouselClearTimeout() {
  if (this.timeoutID) {
    clearTimeout(this.timeoutID);
    this.timeoutID = NaN;
  }
};

/**
 * banner切换
 * @param {number} next - 下一页编号
 * @protected
 */
carouselBase.prototype.mainSwitch = function mainSwitch(next) {
  const offset = `${(1 - next) * 100}%`;

  this.main.data('focus', next)
    .animate({ left: offset }, 500);
};

/**
 * 播放
 * @param {boolean} [reverse=false] - 是否反向播放，反向指播放当前图片左侧的图片
 * @return {number} 下一页编号
 * @protected
 */
carouselBase.prototype.play = function play(reverse = false) {
  const focus = this.main.data('focus');

  let next = this.options.focus;
  if (focus > 0) {
    if (reverse) {
      next = focus === 1 ? this.options.length : focus - 1;
    } else {
      next = focus >= this.options.length ? 1 : focus + 1;
    }
  }

  return next;
};

/**
 * 暂停轮播
 * @protected
 */
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

  // 绑定事件监听
  this.nav.on('click', (e) => {
    e.preventDefault();

    const next = Number($(e.target).data('order'));
    if (next && next > 0) {
      this.combineSwitch(next);
    }
  });
}

Carousel.prototype = Object.create(carouselBase.prototype);
Carousel.prototype.constructor = Carousel;

/**
 * nav切换
 * @param {number} next - 下一页编号
 * @protected
 */
Carousel.prototype.navSwitch = function navSwitch(next) {
  this.nav.children('.slide-nav')
    .removeClass('slide-nav--active')
    .filter(`[data-order="${next}"]`).addClass('slide-nav--active');
};

/**
 * 完成切换任务
 * @param {number} next - 下一页编号
 * @protected
 */
Carousel.prototype.combineSwitch = function combineSwitch(next) {
  this.clearTimeout();

  // main样式、记录修改
  Object.getPrototypeOf(Carousel.prototype).mainSwitch.call(this, next);

  // nav样式修改
  this.navSwitch(next);

  if (this.isAutoplay) {
    this.setTimeout(this.play.bind(this));
  }
};

/**
 * 播放指定页
 * @param {boolean} reverse 是否反向播放，反向指播放当前图片左侧的图片
 * @public
 */
Carousel.prototype.play = function play(reverse) {
  const next = Object.getPrototypeOf(Carousel.prototype).play.call(this, reverse);

  this.combineSwitch(next);
};

/**
 * 自动播放，总是正向播放
 * @public
 */
Carousel.prototype.autoplay = function autoplay() {
  this.isAutoplay = true;

  // 播放初始聚焦页
  this.play();
};

/**
 * 暂停自动播放
 * @public
 */
Carousel.prototype.pause = function pause() {
  Object.getPrototypeOf(Carousel.prototype).pause.call(this);

  this.isAutoplay = false;
};

/**
 * 精简轮播模块
 * @param {string} group   轮播组
 * @param {Object} options 配置
 * @constructor
 */
function CarouselLite(group, options = {}) {
  carouselBase.call(this, group, options);
}

CarouselLite.prototype = Object.create(carouselBase.prototype);
CarouselLite.prototype.constructor = CarouselLite;

/**
 * 自动播放
 * @public
 */
CarouselLite.prototype.play = function play() {
  this.clearTimeout();

  const next = Object.getPrototypeOf(CarouselLite.prototype).play.call(this);
  Object.getPrototypeOf(CarouselLite.prototype).mainSwitch.call(this, next);

  this.setTimeout(this.play.bind(this));
};

/**
 * 自动播放，play的别名
 * @public
 */
CarouselLite.prototype.autoplay = function autoplay() {
  this.play();
};

/**
 * 自动播放，play的别名
 * @public
 */
CarouselLite.prototype.pause = function pause() {
  Object.getPrototypeOf(CarouselLite.prototype).pause.call(this);
};

export { Carousel, CarouselLite };
