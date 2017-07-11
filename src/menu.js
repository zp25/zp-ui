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
    this.nav = this.menu.querySelectorAll('.menu__nav');

    // 绑定事件监听
    Array.from(this.nav).forEach((list) => {
      list.onclick = (e) => {
        e.preventDefault();

        const elem = e.currentTarget;
        this.navSwitch(elem);
      };
    });
  }

  /**
   * nav切换
   * @param {Element} elem - 监听到点击的对象
   * @private
   */
  navSwitch(elem) {
    Array.from(this.nav).forEach((item) => {
      if (item === elem) {
        item.classList.add('menu__nav--active');
      } else {
        item.classList.remove('menu__nav--active');
      }
    });
  }

  /**
   * 打开指定页
   * @param {(number|string)} [id] - 页面id
   */
  open(id) {
    const target = this.menu.querySelector(`.menu__nav[data-page="${id}"]`)
      || this.menu.querySelector('.menu__nav');

    target.querySelector('.menu__anchor').click();
  }
}

export default Menu;
