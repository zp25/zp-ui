import Util from './util';

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
     */
    this.menu = document.querySelector(
      `.menu${this.group ? `[data-group="${this.group}"]` : ''}`);

    /**
     * Menu组件导航区域
     * @type {Element}
     * @private
     */
    this.anchor = this.menu.querySelectorAll('.menu__anchor');

    // 绑定事件监听
    Array.from(this.anchor).forEach((item) => {
      item.addEventListener('click', (e) => {
        this.menuSwitch(e.currentTarget);

        e.preventDefault();
      }, false);
    });
  }

  /**
   * 导航样式切换
   * @param {Element} elem - 监听到点击对象
   * @private
   */
  menuSwitch(elem) {
    Array.from(this.anchor).forEach((item) => {
      if (item === elem) {
        item.classList.add('menu__anchor--active');
      } else {
        item.classList.remove('menu__anchor--active');
      }
    });
  }

  /**
   * 打开指定页，通过点击匹配menu__anchor实现
   * @param {(number|string)} [id] - 页面id，未设置或无匹配menu__anchor将点击Menu容器中第一个menu__anchor
   */
  open(id) {
    const target = this.menu.querySelector(`.menu__anchor[data-page="${id}"]`)
      || this.menu.querySelector('.menu__anchor');

    target.click();
  }
}

export default Menu;
