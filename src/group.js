import Util from './util';

/**
 * @class
 * @implements {Util}
 */
class Group extends Util {
  /**
   * 新建Group实例，通用类
   * @param {string} [group] - 组件分类
   * @augments {Util}
   */
  constructor(group) {
    super(group);

    if (!this.group) {
      throw new Error('Please choose a group');
    }
  }

  /**
   * 所有当前组元素组成的NodeList
   * @return {NodeList}
   * @public
   */
  members() {
    const query = `[data-group~="${this.group}"]`;

    return document.querySelectorAll(query);
  }

  /**
   * 更新状态
   * @param {Object} state - 状态
   */
  update(state = {}) {
    this.subject.state = Object.assign({}, state);
  }

  /**
   * 获取当前状态
   * @return {Object}
   * @public
   */
  getState() {
    return this.subject.state;
  }
}

export default Group;
