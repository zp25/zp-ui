import Util from './util';

/**
 * mask观察者
 * @param {Element} mask - mask对象
 * @return {Observer}
 */
const maskObserver = (mask) => {
  const activeName = 'mask--active';

  return {
    /**
     * mask样式切换
     * @param {Object} state - 状态
     * @param {string} state.hidden - mask是否显示
     */
    update: (state) => {
      if (state.hidden) {
        mask.classList.remove(activeName);
      } else {
        mask.classList.add(activeName);
      }
    },
  };
};

/**
 * panel观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */
const panelObserver = (panels) => {
  const activeName = 'mask__panel--active';

  return {
    /**
     * penel样式切换
     * @param {Object} state - 状态
     * @param {string} state.panel - 当期聚焦页
     */
    update: (state) => {
      const { hidden, panel } = state;
      const panelName = `mask__panel--${state.panel}`;

      panels.forEach((p) => {
        if (hidden || !p.classList.contains(panelName)) {
          p.classList.remove(activeName);
        } else {
          p.classList.add(activeName);
        }
      });
    },
  };
};

/**
 * 提示信息观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */
const messageObserver = panels => ({
  /**
   * 写入提示信息
   * @param {Object} state - 状态
   * @param {string} state.panel - 当期聚焦页
   */
  update: (state) => {
    const { hidden, panel, message } = state;

    const panelName = `mask__panel--${panel}`;
    const target = panels.filter(p => p.classList.contains(panelName));

    if (!hidden) {
      // 提供提示
      if (target.length === 0) {
        throw new Error(`${panelName} not exists`);
      }

      target[0].querySelector('.panel__body .message').innerHTML = message;
    }
  },
});

/**
 * @class
 * @implements {Util}
 */
class Mask extends Util {
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
     * @public
     */
    this.mask = document.querySelector(
      `.mask${this.group ? `[data-group="${this.group}"]` : ''}`);
    /**
     * Mask组件panel区域
     * @type {Array.<Element>}
     * @private
     */
    this.panels = Array.from(this.mask.querySelectorAll('.mask__panel'));

    // 添加默认observer
    this.attach(maskObserver(this.mask));
    this.attach(panelObserver(this.panels));
    this.attach(messageObserver(this.panels));
  }

  /**
   * 提示信息
   * @param {string} name - panel名称，将查找.mask__penel--{name}
   * @param {string} [msg] - 提示信息
   * @throws {Error} 不存在匹配元素.mask__penel--{name}
   */
  prompt(name, msg) {
    // 呈现
    this.subject.state = {
      hidden: false,
      panel: name,
      message: this.constructor.escapeHtml(msg),
    };
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
    this.subject.state = {
      hidden: true,
      panel: '',
      message: '',
    };
  }
}

export default Mask;
