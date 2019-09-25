/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }] */

import Group from './group';

/**
 * @class
 * @implements {Group}
 */
class Carousel extends Group {
  /**
   * 当前是否自动播放
   * @type {Boolean}
   * @private
   */
  isAutoplay = false;

  /**
   * 自动播放定时器
   * @type {Number}
   * @private
   */
  timeoutID = NaN;

  /**
   * 新建Carousel实例
   * @param {string} [group='main'] - 组件分类
   * @param {Object} [opts={}] - 配置
   * @augments {Group}
   */
  constructor(group = 'main', opts = {}) {
    super(group);

    if (typeof opts !== 'object' || !opts) {
      throw new TypeError('not an Object');
    }

    const {
      length,
      focus,
      delay,
    } = opts;

    // Carousel配置，不可变
    this._options = {
      length: ~~length || 1,
      focus: ~~focus || 1,
      delay: ~~delay || 8000,
    };

    Object.freeze(this._options);

    /**
     * 状态
     * @type {Object}
     * @property {number} focus - 当前聚焦页
     */
    this.state = {
      focus: 0, // 使用this.play, this.autoplay初始化并启动
    };
  }

  /**
   * 读取配置
   * @type {Object}
   * @property {number} length - 总页数
   * @property {number} focus - 初始聚焦页，没有上边界判断
   * @property {number} delay - 轮播延时
   * @desc 初始化后不应该被修改，为避免修改而添加getter
   * @public
   */
  get options() {
    return { ...this._options };
  }

  /**
   * 当前聚焦页
   * @type {number}
   * @public
   */
  get focus() {
    const { focus } = this.state;

    return focus;
  }

  /**
   * 初始化自动播放
   * @protected
   * @ignore
   */
  setAutoplay() {
    if (this.isAutoplay) {
      const { delay } = this.options;
      this.timeoutID = setTimeout(this.play.bind(this), delay);
    }
  }

  /**
   * 清理自动播放
   * @protected
   * @ignore
   */
  clearAutoplay() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = NaN;
    }
  }

  /**
   * 播放指定页，尝试启动自动播放
   * @description subject.state更新唯一入口,控制state质量
   * @param {number} to - 下一页编号
   * @protected
   * @ignore
   */
  go(to) {
    const {
      focus: initFocus,
      length,
    } = this.options;

    const nextid = ~~to;

    this.setState({
      focus: nextid > 0 && nextid <= length ? nextid : initFocus,
    });

    this.setAutoplay();
  }

  /**
   * 获取下一播放页编号，若首次运行或this.focus不规范，聚焦到this.options.focus
   * @param {boolean} reverse=false - 是否反向播放，反向指播放页编号比当前页小1
   * @return {number} 下一页编号
   * @protected
   * @ignore
   */
  next(reverse = false) {
    const {
      focus: initFocus,
      length,
    } = this.options;

    const focus = ~~this.focus;

    // 首次执行或不规范focus
    if (!focus) {
      return initFocus;
    }

    if (reverse) {
      return focus <= 1 ? length : focus - 1;
    }

    return focus >= length ? 1 : focus + 1;
  }

  /**
   * 播放下一页或指定页
   * @desc 修改聚焦页的唯一入口
   * @param {(boolean|number)} reverse - 是否反向播放，若number将播放指定页
   * @public
   */
  play(reverse = false) {
    // 总应该尝试清理旧的自动播放
    this.clearAutoplay();

    if (typeof reverse === 'boolean') {
      this.go(this.next(reverse));
    } else {
      this.go(reverse);
    }
  }

  /**
   * 开启自动播放，并播放下一页
   * @public
   */
  autoplay() {
    this.isAutoplay = true;
    this.play();
  }

  /**
   * 暂停自动播放
   * @public
   */
  pause() {
    this.isAutoplay = false;
    this.clearAutoplay();
  }
}

export default Carousel;
