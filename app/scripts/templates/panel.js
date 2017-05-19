/**
 * Panel
 */

import 'babel-polyfill';
import { templater } from '../lib';

export default templater `
  <div class="app app--panel">
    <div class="panel panel--black">
      <div class="panel__head">${'title'}</div>
      <div class="panel__body">${'body'}</div>
    </div>
  </div>
`;
