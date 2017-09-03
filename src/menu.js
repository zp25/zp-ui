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
     */
    update: (state) => {
      const { page: currentPage } = state;

      anchors.forEach((anchor) => {
        const page = anchor.dataset.page;

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

    /**
     * Menu组件容器
     * @type {Element}
     * @public
     */
    this.menu = document.querySelector(
      `.menu${this.group ? `[data-group="${this.group}"]` : ''}`);
    /**
     * Menu组件导航区域
     * @type {Array.<Element>}
     * @private
     */
    this.anchors = Array.from(this.menu.querySelectorAll('.menu__anchor'));

    // 添加默认observer
    this.attach(anchorsObserver(this.anchors));
    // 事件绑定
    this.bind();
  }

  /**
   * 事件绑定
   * @private
   */
  bind() {
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        // 状态存储导航按键的dataset
        this.subject.state = e.currentTarget.dataset;

        e.preventDefault();
      }, false);
    });
  }

  /**
   * 打开指定页，通过点击匹配menu__anchor实现
   * @param {(number|string)} [id] - 页面id，未设置或无匹配menu__anchor将点击Menu容器中第一个menu__anchor
   */
  open(id) {
    const target = this.anchors.filter(anchor => anchor.dataset.page === String(id))[0]
      || this.anchors[0];

    target.click();
  }
}

export default Menu;
