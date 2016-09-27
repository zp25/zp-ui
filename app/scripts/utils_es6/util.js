/**
 * Super Class
 */
export default class {
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
}
