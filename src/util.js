import { Subject } from 'zp-lib';

/**
 * @interface Util
 */

class Util {
  /**
   * 查找最近父元素或当前元素
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill}
   * @param {Element} el - 子元素
   * @param {string} parent - 父元素选择器
   * @return {(Element|null)} 查找到的元素，无匹配返回null
   */
  static closest(el, parent) {
    if (typeof el.closest === 'function') {
      return el.closest(parent);
    }

    const matches = Array.from((el.document || el.ownerDocument).querySelectorAll(parent));

    let node = el;
    let matchedArr = [];

    const cb = m => node === m;

    do {
      matchedArr = matches.filter(cb);
    } while (matchedArr.length === 0 && (node = node.parentElement));

    return node;
  }

  /**
   * 元素是否在y轴可视范围内
   * @param {HTMLElement} item - 需要检测是否在可视范围的元素
   * @return {boolean}
   */
  static inview(item) {
    const rect = item.getBoundingClientRect();
    const itemT = rect.top;
    const itemB = itemT + rect.height;

    return itemB > 0 && itemT < window.innerHeight;
  }

  constructor(group) {
    /**
     * 实例分类，用于单页多实例间区分
     * @type string
     */
    this.group = group;
    /**
     * 被观察者实例
     * @type {Subject}
     */
    this.subject = new Subject();
  }

  /**
   * 为subject绑定observer
   * @param {(Observer|Array.<Observer>)} observer - 观察者对象
   * @return {number} 已绑定observer数量
   */
  attach(observer) {
    const iterable = Array.isArray(observer) ? observer : [observer];

    iterable.forEach((o) => {
      this.subject.attach(o);
    });

    return this.subject.observers.length;
  }

  /**
   * 为subject移除observer
   * @param {(Observer|Array.<Observer>)} observer - 观察者对象
   * @return {number} 已绑定observer数量
   */
  detach(observer) {
    const iterable = Array.isArray(observer) ? observer : [observer];

    iterable.forEach((o) => {
      this.subject.detach(o);
    });

    return this.subject.observers.length;
  }

  /**
   * 状态切换
   * @param {string} action - 输入
   * @param {Object} data - 额外数据，用于合并到state
   */
  setState(data = {}) {
    if (!(data instanceof Object)) {
      throw new TypeError('Not an Object');
    }

    const filtered = Object.entries(data).reduce((prev, [key, val]) => {
      if ({}.hasOwnProperty.call(this.state, key)) {
        return Object.assign({}, prev, { [key]: val });
      }

      return prev;
    }, {});

    this.state = Object.assign({}, this.state, filtered);
  }
}

export default Util;
