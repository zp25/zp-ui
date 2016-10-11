/**
 * Super Class
 */
export default class {
  constructor(group) {
    // 组
    this.group = group;
  }

  /**
   * 查找最近父节点
   * @param  {element} elem 子节点
   * @param  {string} parent 父节点class
   * @return {(element|undefined)} 查找到的父节点或undefined
   */
  static parents(elem, parent) {
    let node = elem;

    while ((node = node.parentElement)) {
      if (node.classList.contains(parent)) {
        break;
      }
    }

    return node;
  }

  /**
   * escape HTML
   * @see {@link https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406}
   * @param  {string} unsafe 需转义字符串
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
