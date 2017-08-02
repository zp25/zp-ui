import Util from './util';

/**
 * @class
 * @implements {Util}
 */
class Mask extends Util {
  /**
   * 写入提示信息
   * @param {Element} elem - 需写入信息的panel
   * @param {string} [msg=''] - 信息内容
   * @private
   */
  static insertMsg(elem, msg = '') {
    const escapedMsg = this.escapeHtml(msg);
    elem.querySelector('.panel__body .message').innerHTML = escapedMsg;
  }

  /**
   * 新建Mask实例
   * @param {string} [group] - 组件分类，区别单页中多个Mask组件，若单页仅一个Mask可忽略
   * @augments {Util}
   */
  constructor(group) {
    super(group);

    /**
     * Mask组件容器
     * @type {Element}
     */
    this.mask = document.querySelector(
      `.mask${this.group ? `[data-group="${this.group}"]` : ''}`);
  }

  /**
   * panel切换
   * @param {Element} [elem] - 需显示的panel，未设置则隐藏全部panel
   * @private
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
   * 显示Mask
   * @private
   */
  show() {
    this.mask.classList.add('mask--active');
  }

  /**
   * 提示信息
   * @param {string} name - panel名称，将查找.mask__penel--{name}
   * @param {string} [msg] - 提示信息
   * @throws {Error} 不存在匹配元素.mask__penel--{name}
   */
  prompt(name, msg) {
    const panel = this.mask.querySelector(`.mask__panel--${name}`);

    if (!panel) {
      throw new Error(`.mask__panel--${name} not exists`);
    }

    // 提示信息
    this.constructor.insertMsg(panel, msg);

    // 呈现
    this.panelSwitch(panel);
    this.show();
  }

  /**
   * loading效果
   * @param {string} [msg] - 提示信息
   */
  loading(msg) {
    this.prompt('loading', msg);
  }

  /**
   * 隐藏Mask
   */
  hide() {
    this.mask.classList.remove('mask--active');

    this.panelSwitch();
  }
}

export default Mask;
