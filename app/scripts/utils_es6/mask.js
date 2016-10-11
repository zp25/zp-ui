import 'babel-polyfill';
import Util from './util';

export default class extends Util {
  constructor(group = '') {
    super(group);

    // 主要元素
    this.mask = document.querySelector(
      `.mask${this.group ? `[data-group="${this.group}"]` : ''}`
    );
    this.main = this.mask.querySelector('.mask__panel');

    // 定时器
    this.interval = NaN;
  }

  /**
   * 加载中
   * @param {string} msg 提示信息
   */
  loading(msg = 'Loading') {
    const load = this.main.querySelector('.loading');

    // loading动画效果
    this.interval = setInterval(() => {
      let pos = Number(load.dataset.pos) || 1;

      pos += (pos >= 12 ? -11 : 1);
      load.dataset.pos = pos;
    }, 100);

    // 提示信息
    const escapedMsg = this.constructor.escapeHtml(msg);
    this.main.querySelector('.desc').innerHTML = escapedMsg;

    // 样式修改
    Array.from(this.mask.querySelectorAll('.mask__panel')).forEach((item) => {
      if (item !== this.main) {
        item.classList.add('hidden');
        return;
      }

      item.classList.remove('hidden');
    });

    this.show();
  }

  /**
   * 提示信息
   * @param {string} msg 提示信息
   */
  message(msg) {
    const target = this.mask.querySelector('.mask__panel--message');

    // 提示信息
    const escapedMsg = this.constructor.escapeHtml(msg);
    target.querySelector('.panel__body').innerHTML = escapedMsg;

    // 样式修改
    Array.from(this.mask.querySelectorAll('.mask__panel')).forEach((item) => {
      if (item !== target) {
        item.classList.add('hidden');
        return;
      }

      item.classList.remove('hidden');
    });

    this.show();
  }

  /**
   * 显示
   */
  show() {
    this.mask.classList.remove('hidden');
  }

  /**
   * 隐藏并清理
   */
  hide() {
    this.mask.classList.add('hidden');

    Array.from(this.mask.querySelectorAll('.mask__panel')).forEach((item) => {
      item.classList.add('hidden');
    });

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = NaN;
    }
  }
}
