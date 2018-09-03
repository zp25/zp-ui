import {
  escapeHTML,
  machine,
} from 'zp-lib';
import Util from './util';

/**
 * dialog观察者
 * @return {Observer}
 */
function dialogObserver() {
  return {
    /**
     * 判断是否存在dialog
     * @param {Object} state - 状态
     * @param {(boolean|string)} state.modal - modal是否显示
     * @throws {Error} 不存在匹配元素.modal__dialog--{name}
     */
    update: (state) => {
      const { modal } = state;

      if (modal && typeof modal === 'string') {
        const dialogName = `modal__dialog--${modal}`;
        const target = this.modal.querySelector(`.${dialogName}`);

        if (!target) {
          throw new Error(`.${dialogName} not exist`);
        }
      }
    },
  };
}

/**
 * modal观察者，控制开关
 * @param {Element} modal - modal对象
 * @return {Observer}
 * @this {Modal}
 */
function modalObserver() {
  const activeName = 'modal--active';
  const dialogActive = 'modal__dialog--active';

  return {
    /**
     * modal样式切换
     * @param {Object} state - 状态
     * @param {(boolean|string)} state.modal - 若bool判断modal是否显示；若非空str判断打开的dialog，此时modal总是显示
     * @ignore
     */
    update: (state) => {
      const { modal } = state;

      /**
       * Modal组件dialogs
       * @type {NodeList}
       */
      const dialogs = this.modal.querySelectorAll('.modal__dialog');

      // truthy总是打开modal
      if (modal) {
        this.modal.classList.add(activeName);

        const dialogName = typeof modal === 'string' && `modal__dialog--${modal}`;
        dialogs.forEach((d) => {
          if (d.classList.contains(dialogName)) {
            d.classList.add(dialogActive);
          } else {
            d.classList.remove(dialogActive);
          }
        });
      } else {
        this.modal.classList.remove(activeName);

        dialogs.forEach((d) => {
          d.classList.remove(dialogActive);
        });
      }
    },
  };
}

/**
 * 提示信息观察者，控制显示的提示信息
 * @param {Element} wrapper - Modal组件容器
 * @return {Observer}
 */
const messageObserver = wrapper => ({
  /**
   * 写入提示信息，若没有message子元素暂时不做任何操作
   * @param {Object} state - 状态
   * @param {(boolean|string)} state.modal - modal是否显示
   * @param {string} state.message - 提示信息，已html转义
   * @ignore
   */
  update: (state) => {
    const {
      modal,
      message,
    } = state;

    let target = null;
    if (
      modal
      && typeof modal === 'string'
      && (target = wrapper.querySelector(`.modal__dialog--${modal} .message`))
    ) {
      target.innerHTML = message;
    }
  },
});

/**
 * dialog状态查询字典
 * @type {Object}
 * @ignore
 */
const ModalDict = {
  visible: {
    MODALCLOSE: 'hidden',
    MODALOPEN: 'visible',
  },
  hidden: {
    MODALOPEN: 'visible',
  },
};

/**
 * @class
 * @implements {Util}
 */
class Modal extends Util {
  /**
   * 关联core state和fsm
   * @param {(string|boolean)} modal - core state中modal和dialog显示信息
   * @return {string}
   * @ignore
   */
  static currentState(modal) {
    return modal ? 'visible' : 'hidden';
  }

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

    // 添加默认observer
    this.attach([
      dialogObserver.call(this),
      modalObserver.call(this),
      messageObserver(this.modal),
    ]);
    // 添加状态机
    this.machine = machine(ModalDict);
  }

  /**
   * 提示信息
   * @param {string} name - dialog名称，将查找.modal__dialog--{name}
   * @param {*} [message=''] - 提示信息，注意0等值
   * @public
   */
  prompt(name = '', message = '') {
    const { modal } = this.subject.state;

    const currentState = this.constructor.currentState(modal);
    const nextState = this.machine(currentState)('MODALOPEN');

    if (nextState === 'visible') {
      this.subject.state = {
        modal: name || true,
        message: escapeHTML(String(message)),
      };
    }
  }

  /**
   * loading效果
   * @public
   */
  loading() {
    this.prompt('loading');
  }

  /**
   * 显示Modal，不显示任何dialog
   * @public
   */
  open() {
    this.prompt();
  }

  /**
   * 隐藏Modal，不显示任何dialog
   * @public
   */
  close() {
    const { modal } = this.subject.state;

    const currentState = this.constructor.currentState(modal);
    const nextState = this.machine(currentState)('MODALCLOSE');

    if (nextState === 'hidden') {
      this.subject.state = {
        modal: false,
        message: '',
      };
    }
  }
}

export default Modal;
