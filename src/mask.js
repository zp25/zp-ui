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
     * @param {boolean} state.hidden - mask是否显示
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
     * @param {boolean} state.hidden - mask是否显示
     * @param {string} state.panel - 当期聚焦页
     */
    update: (state) => {
      const { hidden, panel } = state;
      const panelName = panel && `mask__panel--${panel}`;

      panels.forEach((p) => {
        if (hidden || !panelName || !p.classList.contains(panelName)) {
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
   * 写入提示信息，若没有message子元素暂时不做任何操作
   * @param {Object} state - 状态
   * @param {boolean} state.hidden - mask是否显示
   * @param {string} state.panel - 当期聚焦页
   * @param {string} state.message - 提示信息
   * @throws {Error} 不存在匹配元素.mask__penel--{name}
   */
  update: (state) => {
    const { hidden, panel, message } = state;

    const panelName = panel && `mask__panel--${panel}`;
    const panelTarget = panelName && panels.find(p => p.classList.contains(panelName));

    if (!hidden && panelName) {
      // 提供提示
      if (!panelTarget) {
        throw new Error(`${panelName} not exists`);
      }

      const target = panelTarget.querySelector('.message');
      if (target) {
        target.innerHTML = message;
      }
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

    const query = `.mask${this.group ? `[data-group="${this.group}"]` : ''}`;
    /**
     * Mask组件容器
     * @type {Element}
     * @public
     */
    this.mask = document.querySelector(query);
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
   * @param {*} [msg=''] - 提示信息，注意0等值
   */
  prompt(name, msg = '') {
    this.subject.state = {
      hidden: false,
      panel: name,
      message: msg === null ? 'null' : this.constructor.escapeHtml(msg.toString()),
    };
  }

  /**
   * loading效果
   * @param {string} [msg] - 提示信息
   */
  loading(msg = '') {
    this.prompt('loading', msg);
  }

  /**
   * 显示Mask，不显示任何panel
   */
  show() {
    this.subject.state = {
      hidden: false,
      panel: '',
      message: '',
    };
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
