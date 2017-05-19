/**
 * Carousel精简版
 */

import 'babel-polyfill';
import { templater } from '../lib';

const list = param => param.reduce(prev => `${prev}<li class="slide-banner"></li>`, '');

list.displayName = 'list';

export default templater `
  <div class="app app--carousel">
    <div class="carousel" data-group="lite">
      <ul class="carousel__main">${list}</ul>
    </div>
  </div>
`;
