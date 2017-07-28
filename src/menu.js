import Util from './util';

/**
 * @class
 * @implements {Util}
 */
class Menu extends Util {
  /**
   * 新建Menu实例
   * @param {string} group='' - 组件分类
   * @augments {Util}
   */
  constructor(group = '') {
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
   * 打开指定页
   * @param {(number|string)} [id] - 页面id
   */
  open(id) {
    const target = this.menu.querySelector(`.menu__anchor[data-page="${id}"]`)
      || this.menu.querySelector('.menu__anchor');

    target.click();
  }
}

export default Menu;
