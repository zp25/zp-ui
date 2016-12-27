import 'es5-shim';
import 'es5-shim/es5-sham';
import { Carousel, CarouselLite } from './utils/carousel';

/**
 * carousel自定义导航的处理函数
 * @param {Event} e 事件对象
 * @param {Object} carousel 受控制的carousel对象
 */
function customNav(e, carousel) {
  e.preventDefault();

  const reverse = $(e.target).data('reverse');
  carousel.play(reverse);
}

/**
 * 事件处理
 * @param {Object} e 事件对象
 * @param {Object} carousel 受控制的carousel对象
 */
function eventHandler(e, carousel) {
  const trigger = $(e.target).data('trigger');

  switch (trigger) {
    case 'custom-nav':
      customNav(e, carousel);
      break;
    default:
      e.stopPropagation();
  }
}

$(() => {
  // carousel
  const carousel = new Carousel('main', { focus: 2, delay: 8000 });
  carousel.autoplay();

  // carousel lite
  const carousellite = new CarouselLite('lite', { focus: 3, delay: 4000 });
  carousellite.autoplay();

  // event listener
  $('body').on('click', (e) => { eventHandler(e, carousel); });
});
