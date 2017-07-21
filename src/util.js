/**
 * @interface Util
 */

class Util {
  constructor(group) {
    /**
     * 实例分类，用于单页多实例间区分
     * @type string
     */
    this.group = group;
  }

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
   * escape HTML
   * @see {@link https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406}
   * @param {string} unsafe - 需转义字符串
   * @return {string} 转义后字符串
   */
  static escapeHtml(unsafe) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return unsafe.replace(/[&<>"']/g, m => map[m]);
  }
}

export default Util;
