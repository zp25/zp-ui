import 'babel-polyfill';
import Util from './util';

/**
 * @class Menu
 * @implements {Util}
 */
class Menu extends Util {
  constructor(group = '') {
    super(group);

    // 主要元素
    this.menu = document.querySelector(
      `.menu${this.group ? `[data-group="${this.group}"]` : ''}`);
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
   * 初始化，显示默认页面
   * @public
   */
  open(id) {
    const target = this.menu.querySelector(`.menu__nav[data-page="${id}"]`)
      || this.menu.querySelector('.menu__nav');

    target.querySelector('.menu__nav__anchor').click();
  }
}

export default Menu;
