/**
 * 模版引擎
 * @module templater
 */

import 'babel-polyfill';

export default (strs, ...keys) => (data) => {
  const arr = Array.isArray(data) ? data.slice() : [Object.assign({}, data)];
  const lastIndex = strs.length - 1;

  const dataArr = arr.map(d => (
    keys.map((key, i) => {
      let replace = '';
      if (typeof key === 'function') {
        replace = key(d[key.displayName]);
      } else if (typeof key === 'object') {
        replace = key.content(d[key.name]);
      } else {
        replace = d[key];
      }

      return strs[i] + replace;
    }).join('') + strs[lastIndex]
  ));

  return dataArr.join('');
};
