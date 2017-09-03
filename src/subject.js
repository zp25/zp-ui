/**
 * @typedef {Object} Observer
 * @property {Function} update - 更新状态
 */

/**
 * @class
 * @description 被观察者
 */
class Subject {
  constructor() {
    /**
     * 观察者序列
     * @type {Array.<Observer>}
     * @public
     */
    this.observers = [];
    /**
     * 被观察者状态
     * @type {Object}
     * @private
     */
    this._state = null;
  }

  /**
   * 绑定观察者
   * @param {Observer} observer - 观察者对象
   * @public
   */
  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers = this.observers.concat(observer);
    }
  }

  /**
   * 解绑观察者
   * @param {Observer} observer - 观察者对象
   * @public
   */
  detach(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  /**
   * 获取状态
   * @return {Object}
   * @public
   */
  get state() {
    return Object.assign({}, this._state);
  }

  /**
   * 更新状态
   * @param {Object} obj - 更新
   * @public
   */
  set state(obj) {
    this._state = Object.assign({}, this._state, obj);
    this.notify();
  }

  /**
   * 通知观察者状态变化
   * @public
   */
  notify() {
    this.observers.forEach((o) => {
      if ({}.hasOwnProperty.call(o, 'update')) {
        o.update(this.state);
      }
    });
  }
}

export default Subject;
