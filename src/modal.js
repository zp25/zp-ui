import { machine } from 'zp-lib';
import Group from './group';

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

// 添加状态机
const modalMachine = machine(ModalDict);

/**
 * @class
 * @implements {Group}
 */
class Modal extends Group {
  /**
   * 关联core state和fsm
   * @param {boolean} modal - core state中modal是否显示
   * @return {string}
   * @ignore
   */
  static currentState(modal) {
    if (typeof modal !== 'boolean') {
      throw new TypeError('double check modal state');
    }

    return modal ? 'visible' : 'hidden';
  }

  /**
   * 新建Modal实例
   * @desc 保证同一时间仅一个dialog显示
   * @param {string} [group='main'] - 组件分类，区别单页中多个Modal组件
   * @augments {Group}
   */
  constructor(group = 'main') {
    super(group);

    /**
     * 状态
     * @type {Object}
     * @property {boolean} modal - modal是否开启
     * @property {string} dialog - 聚焦的dialog
     */
    this.state = {
      modal: false,
      dialog: '',
    };
  }

  /**
   * 提示窗口
   * @param {string} name - dialog名称
   * @return {boolean} - 是否尝试修改状态
   * @public
   */
  prompt(dialog = '') {
    const { modal } = this.state;

    const currentState = this.constructor.currentState(modal);
    const nextState = modalMachine(currentState)('MODALOPEN');

    if (nextState === 'visible') {
      this.setState({
        modal: true,
        dialog: dialog.toString(),
      });

      return true;
    }

    return false;
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
   * @return {boolean} - 是否尝试修改状态
   * @public
   */
  close() {
    const { modal } = this.state;

    const currentState = this.constructor.currentState(modal);
    const nextState = modalMachine(currentState)('MODALCLOSE');

    if (nextState === 'hidden') {
      this.setState({
        modal: false,
        dialog: '',
      });

      return true;
    }

    return false;
  }
}

export default Modal;
