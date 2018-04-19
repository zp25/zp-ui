import Util from './util';

/**
 * modal观察者
 * @param {Element} modal - modal对象
 * @return {Observer}
 */
const modalObserver = (modal) => {
  const activeName = 'modal--active';

  return {
    /**
     * modal样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - modal是否显示
     */
    update: (state) => {
      if (state.hidden) {
        modal.classList.remove(activeName);
      } else {
        modal.classList.add(activeName);
      }
    },
  };
};

/**
 * dialog观察者
 * @param {Array.<Element>} dialogs - Modal组件dialog区域
 * @return {Observer}
 */
const dialogObserver = (dialogs) => {
  const activeName = 'modal__dialog--active';

  return {
    /**
     * dialog样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - modal是否显示
     * @param {string} state.dialog - 当期聚焦dialog
     */
    update: (state) => {
      const { hidden, dialog } = state;
      const dialogName = dialog && `modal__dialog--${dialog}`;

      dialogs.forEach((p) => {
        if (hidden || !dialogName || !p.classList.contains(dialogName)) {
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
 * @param {Array.<Element>} dialogs - Modal组件dialog区域
 * @return {Observer}
 */
const messageObserver = dialogs => ({
  /**
   * 写入提示信息，若没有message子元素暂时不做任何操作
   * @param {Object} state - 状态
   * @param {boolean} state.hidden - modal是否显示
   * @param {string} state.dialog - 当期聚焦dialog
   * @param {string} state.message - 提示信息
   * @throws {Error} 不存在匹配元素.modal__dialog--{name}
   */
  update: (state) => {
    const {
      hidden,
      dialog,
      message,
    } = state;

    const dialogName = dialog && `modal__dialog--${dialog}`;
    const dialogTarget = dialogName && dialogs.find(p => p.classList.contains(dialogName));

    if (!hidden && dialogName) {
      // 提供提示
      if (!dialogTarget) {
        throw new Error(`${dialogName} not exists`);
      }

      const target = dialogTarget.querySelector('.message');
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
class Modal extends Util {
  /**
   * 新建Modal实例
   * @param {string} [group] - 组件分类，区别单页中多个Modal组件，若单页仅一个Modal可忽略
   * @augments {Util}
   */
  constructor(group) {
    super(group);

    const query = `.modal${this.group ? `[data-group="${this.group}"]` : ''}`;
    /**
     * Modal组件容器
     * @type {Element}
     * @public
     */
    this.modal = document.querySelector(query);
    /**
     * Modal组件panel区域
     * @type {Array.<Element>}
     * @private
     */
    this.dialogs = Array.from(this.modal.querySelectorAll('.modal__dialog'));

    // 添加默认observer
    this.attach([
      modalObserver(this.modal),
      dialogObserver(this.dialogs),
      messageObserver(this.dialogs),
    ]);
  }

  /**
   * 提示信息
   * @param {string} name - dialog名称，将查找.modal__dialog--{name}
   * @param {*} [msg=''] - 提示信息，注意0等值
   */
  prompt(name, msg = '') {
    this.subject.state = {
      hidden: false,
      dialog: name,
      message: msg === null ? 'null' : this.constructor.escapeHtml(msg.toString()),
    };
  }

  /**
   * loading效果
   */
  loading() {
    this.prompt('loading');
  }

  /**
   * 显示Modal，不显示任何panel
   */
  open() {
    this.subject.state = {
      hidden: false,
      dialog: '',
      message: '',
    };
  }

  /**
   * 隐藏Modal
   */
  close() {
    this.subject.state = {
      hidden: true,
      dialog: '',
      message: '',
    };
  }
}

export default Modal;
