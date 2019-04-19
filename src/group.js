/* eslint no-underscore-dangle: ["error", { "allow": ["_group"] }] */

import { Subject } from 'zp-lib';

/**
 * @class
 * @implements {Subject}
 */
class Group extends Subject {
  /**
   * 新建Group实例，通用类
   * @param {string} group - 分组
   */
  constructor(group) {
    super();

    if (!group) {
      throw new Error('Please choose a group');
    }

    /**
     * 实例分组，用于单页多实例间区分
     * @type string
     * @private
     */
    this._group = String(group);
  }

  /**
   * 获取分组
   * @type {string}
   * @public
   */
  get group() {
    return this._group;
  }
}

export default Group;
