import 'babel-polyfill';
import Util from './util';

/**
 * @class
 * @implements {Util}
 */
class Mask extends Util {
  /**
   * 向目标写入提示信息
   * @param {Element} elem - 需写入信息的panel
   * @param {string} msg - 信息内容
   * @static
   */
  static insertMsg(elem, msg) {
    const escapedMsg = this.escapeHtml(msg);
    elem.querySelector('.panel__body .message').innerHTML = escapedMsg;
  }

  constructor(group = '') {
    super(group);

    // 主要元素
    this.mask = document.querySelector(
      `.mask${this.group ? `[data-group="${this.group}"]` : ''}`);
  }

  /**
   * panel切换
   * @param {Element} [elem] - 需显示的panel，未设置则隐藏全部panel
   * @protected
   */
  panelSwitch(elem) {
    Array.from(this.mask.querySelectorAll('.mask__panel')).forEach((item) => {
      if (item === elem) {
        item.classList.add('mask__panel--active');
      } else {
        item.classList.remove('mask__panel--active');
      }
    });
  }

  /**
   * mask显示
   * @protected
   */
  show() {
    this.mask.classList.add('mask--active');
  }

  /**
   * 提示信息
   * @param {string} [name='loading'] - panel名称
   * @param {string} [msg='Loading'] - 提示信息
   * @public
   */
  prompt(type = 'loading', msg = 'Loading') {
    const panel = this.mask.querySelector(`.mask__panel--${type}`);

    if (panel) {
      // 提示信息
      this.constructor.insertMsg(panel, msg);

      // 呈现
      this.panelSwitch(panel);
      this.show();
    }
  }

  /**
   * loading效果
   * @param {string} [msg='Loading'] - 提示信息
   */
  loading(msg = 'Loading') {
    this.prompt('loading', msg);
  }

  /**
   * 隐藏并清理
   * @public
   */
  hide() {
    this.mask.classList.remove('mask--active');

    this.panelSwitch();

    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = NaN;
    }
  }
}

export default Mask;
