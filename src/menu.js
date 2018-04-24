import Util from './util';

/**
 * 导航区域观察者
 * @param {Array.<Element>} anchors - Menu组件导航区域
 * @return {Observer}
 */
const anchorsObserver = (anchors) => {
  const activeName = 'menu__anchor--active';

  return {
    /**
     * 导航区域样式切换
     * @param {Object} state - 状态
     * @param {string} state.page - 当期聚焦页
     * @ignore
     */
    update: (state) => {
      const { page: currentPage } = state;

      anchors.forEach((anchor) => {
        const { page } = anchor.dataset;

        if (page === currentPage) {
          anchor.classList.add(activeName);
        } else {
          anchor.classList.remove(activeName);
        }
      });
    },
  };
};

/**
 * @class
 * @implements {Util}
 */
class Menu extends Util {
  /**
   * 新建Menu实例
   * @param {string} [group] - 组件分类，区别单页中多个Menu组件，若单页仅一个Menu可忽略
   * @augments {Util}
   */
  constructor(group) {
    super(group);

    const query = `.menu${this.group ? `[data-group="${this.group}"]` : ''}`;
    /**
     * Menu组件容器
     * @type {Element}
     * @public
     */
    this.menu = document.querySelector(query);
    /**
     * Menu组件导航区域
     * @type {Array.<Element>}
     * @private
     */
    this.anchors = Array.from(this.menu.querySelectorAll('.menu__anchor'));

    // 添加默认observer
    this.attach(anchorsObserver(this.anchors));
  }

  /**
   * 打开指定页
   * @param {(number|string)} id - 页面id，通过设置anchor的data-page确定
   * @param {boolean} [fallback=false] - 无匹配id的anchor时是否使用fallback anchor，即第一个anchor
   * @throws {Error} 无匹配id的anchor且不使用fallback anchor时抛出错误
   */
  open(id, fallback = false) {
    let target = this.anchors.find(anchor => anchor.dataset.page === id.toString());

    if (!target && !fallback) {
      throw new Error(`Menu: ${id} not exists`);
    }

    target = target || this.anchors[0];

    this.subject.state = Object.assign({}, target.dataset);
  }

  /**
   * 当前聚焦的page
   * @return {string}
   * @public
   */
  get page() {
    return this.subject.state.page || '';
  }
}

export default Menu;
