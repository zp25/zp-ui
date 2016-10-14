import { Carousel, CarouselLite } from './utils_es6/carousel';
import Mask from './utils_es6/mask';

/**
 * 事件处理
 * @param {Object} e 事件对象
 * @param {Object} mask mask对象
 */
function eventHandler(e, mask) {
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

  // event listener
  document.body.addEventListener('click', (e) => { eventHandler(e, mask); }, false);
}, false);
