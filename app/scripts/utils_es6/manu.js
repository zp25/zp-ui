import 'babel-polyfill';
import Util from './util';

export default class extends Util {
  constructor(group = '') {
    super(group);

    // 主要元素
    this.manu = document.querySelector(
      `.manu${this.group ? `[data-group="${this.group}"]` : ''}`
    );

    // 绑定事件监听
    this.bind();
  }

  /**
   * 绑定事件监听
   */
  bind() {
    Array.from(this.manu.querySelectorAll('.manu__nav')).forEach((list) => {
      list.onclick = (e) => {
        e.preventDefault();

        this.handle(e);
      };
    });
  }

  /**
   * 导航回调
   * @param {Object} e 事件对象
   */
  handle(e) {
    // nav，修改样式
    Array.from(this.manu.querySelectorAll('.manu__nav')).forEach((list) => {
      if (e.currentTarget === list) {
        list.classList.add('manu__nav--active');
      } else {
        list.classList.remove('manu__nav--active');
      }
    });
  }

  /**
   * 初始化，显示默认页面
   */
  init() {
    const target = this.manu.querySelector('.manu__nav[data-default="true"]')
      || this.manu.querySelector('.manu__nav');

    target.querySelector('.manu__nav__anchor').click();
  }
}
