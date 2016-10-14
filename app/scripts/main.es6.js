import { Carousel, CarouselLite } from './utils_es6/carousel';
import Mask from './utils_es6/mask';
import Manu from './utils_es6/manu';

/**
 * carousel自定义导航的处理函数
 * @param {Event} e 事件对象
 * @param {Object} carousel 受控制的carousel对象
 */
function customNav(e, carousel) {
  e.preventDefault();

  const reverse = e.target.dataset.reverse === 'true';
  carousel.play(reverse);
}

/**
 * 事件处理
 * @param {Object} e 事件对象
 * @param {Object} mask mask对象
 * @param {Object} carousel 受控制的carousel对象
 */
function eventHandler(e, mask, carousel) {
  const trigger = e.target.dataset.trigger;

  switch (trigger) {
    case 'loading':
      mask.loading();
      break;
    case 'message':
      mask.message('可填写3行提示信息');
      break;
    case 'switch':
      mask.loading();
      setTimeout(() => { mask.message('Loading结束'); }, 2000);
      break;
    case 'close':
      e.preventDefault();
      mask.hide();
      break;
    case 'custom-nav':
      customNav(e, carousel);
      break;
    default:
      e.stopPropagation();
  }
}

/** Events */
document.addEventListener('DOMContentLoaded', () => {
  // carousel
  const carousel = new Carousel('main', { focus: 2, delay: 8000 });
  carousel.autoplay();

  // carousel lite
  const carousellite = new CarouselLite('lite', { focus: 3, delay: 4000 });
  carousellite.autoplay();

  // mask
  const mask = new Mask('main');
  mask.hide();

  // manu
  const manu = new Manu('main');
  manu.init();

  // event listener
  document.body.addEventListener('click', (e) => { eventHandler(e, mask, carousel); }, false);
}, false);
