import 'babel-polyfill';
import { dispatcher } from './lib';
import createClickHandler from './handlers';

import ui from './ui';
import {
  Carousel,
  CarouselLite,
  Mask,
  Menu,
} from '../../index';

/**
 * 首次呈现
 */
const render = () => {
  const sec = ui();

  Object.keys(sec).forEach((key) => {
    sec[key]();
  });
};

/** Events */
document.addEventListener('DOMContentLoaded', () => {
  render();

  // carousel
  const carousel = new Carousel('main', { focus: 2, delay: 8000 });
  carousel.autoplay();

  // carousel lite
  const carousellite = new CarouselLite('lite', { delay: 4000 });
  carousellite.autoplay();

  // mask
  const mask = new Mask('main');
  mask.hide();

  // menu
  const menu = new Menu('main');
  menu.open(2);

  // event listener
  const handler = createClickHandler({ mask, carousel });
  document.body.addEventListener('click', dispatcher(handler), false);
}, false);
