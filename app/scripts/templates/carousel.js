/**
 * Carousel
 * 可自定义前后导航，Carousel.play(reverse)方法提供反向播放功能，但自动播放只能正向播放
 */

import 'babel-polyfill';
import { templater } from '../lib';

const list = (type) => {
  /**
   * 制作banner
   * @return {function}
   */
  const main = param => param.reduce(prev => `${prev}<li class="slide-banner"></li>`, '');

  /**
   * 制作nav
   * @return {function}
   */
  const nav = param => param.reduce((prev, d, index) => (
    `${prev}<a href="#slide" class="slide-nav" data-order="${index + 1}"></a>`
  ), '');

  return {
    name: 'list',
    content: type === 'main' ? main : nav,
  };
};

export default templater `
  <div class="app app--carousel">
    <div class="carousel" data-group="main">
      <ul class="carousel__main">${list('main')}</ul>
      <div class="carousel__nav">${list('nav')}</div>
    </div>

    <!-- 自定义导航 -->
    <div class="custom-nav">
      <button class="custom-nav__btn custom-nav__btn--l" data-trigger="customNav" data-reverse="true">cL</button>
      <button class="custom-nav__btn custom-nav__btn--r" data-trigger="customNav">cR</button>
    </div>
  </div>
`;
