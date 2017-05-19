import { Carousel, CarouselLite } from '../../legacy/carousel';

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
 */
const handler = carousel => (e) => {
  const trigger = $(e.target).data('trigger');

  if (trigger === 'customNav') {
    customNav(e, carousel);
  } else if (trigger === 'pass') {
    e.preventDefault();
  }
};

$(() => {
  // carousel
  const carousel = new Carousel('main', { focus: 2, delay: 8000 });
  carousel.autoplay();

  // carousel lite
  const carousellite = new CarouselLite('lite', { delay: 4000 });
  carousellite.autoplay();

  // event listener
  $('body').on('click', handler(carousel));
});
