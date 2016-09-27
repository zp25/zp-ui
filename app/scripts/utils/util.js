/* eslint no-unused-vars:1, no-proto: 0 */

if (typeof Object.create !== 'function') {
  // lt ie9
  Object.create = (obj) => {
    function F() {}
    F.prototype = obj;

    const f = new F();
    // lt ie11
    f.__proto__ = F.prototype;

    return f;
  };
}

if (typeof Object.getPrototypeOf !== 'function') {
  // lt ie9
  Object.getPrototypeOf = obj => obj.__proto__;
}
