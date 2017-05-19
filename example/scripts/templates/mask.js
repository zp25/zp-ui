/**
 * Mask
 */

import 'babel-polyfill';
import { templater } from '../lib';

const circles = () => {
  const arr = new Array(12);
  arr.fill(0);

  return arr.reduce((prev, d, index) => (
    `${prev}<span class="loading__circle loading__circle--${index + 1}"></span>`
  ), '');
};

circles.displayName = 'circles';

export default templater `
  <div class="app app--mask mask" data-group="main">
    <div class="mask__panel mask__panel--loading panel panel--black-reverse">
      <div class="panel__body">
        <div class="loading">${circles}</div>
        <p class="message">${'loading'}</p>
      </div>
    </div>

    <div class="mask__panel mask__panel--message panel panel--black-reverse">
      <div class="panel__body">
        <p class="message">${'message'}</p>
      </div>
    </div>

    <!-- 自定义关闭按钮 -->
    <a href="#close" class="btn close" data-trigger="close">close</a>
  </div>
`;
