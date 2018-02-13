'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return _get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _sliceIterator(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _slicedToArray(arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    return _sliceIterator(arr, i);
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
}

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

var _iterators = {};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

// check on default Array iterator

var ITERATOR = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$2 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$2]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$2]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$2] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) {  }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);
  var fns = exec(_defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (_fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    _redefine(String.prototype, KEY, strfn);
    _hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto$1 = Array.prototype;
if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto$1[UNSCOPABLES][key] = true;
};

// https://github.com/tc39/Array.prototype.includes

var $includes = _arrayIncludes(true);

_export(_export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

_addToUnscopables('includes');

// 7.2.8 IsRegExp(argument)


var MATCH = _wks('match');
var _isRegexp = function (it) {
  var isRegExp;
  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
};

// helper for String#{startsWith, endsWith, includes}



var _stringContext = function (that, searchString, NAME) {
  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(_defined(that));
};

var MATCH$1 = _wks('match');
var _failsIsRegexp = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH$1] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

var INCLUDES = 'includes';

_export(_export.P + _export.F * _failsIsRegexp(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~_stringContext(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/* eslint no-underscore-dangle:0 */

/**
 * @typedef {Object} Observer
 * @property {Function} update - 更新状态
 */

/**
 * @class
 * @description 被观察者
 */
var Subject =
/*#__PURE__*/
function () {
  function Subject() {
    _classCallCheck(this, Subject);

    /**
     * 观察者序列
     * @type {Array.<Observer>}
     * @public
     */
    this.observers = [];
    /**
     * 被观察者状态
     * @type {Object}
     * @private
     */

    this._state = null;
  }
  /**
   * 绑定观察者
   * @param {Observer} observer - 观察者对象
   * @public
   */


  _createClass(Subject, [{
    key: "attach",
    value: function attach(observer) {
      if (!this.observers.includes(observer)) {
        this.observers = this.observers.concat(observer);
      }
    }
    /**
     * 解绑观察者
     * @param {Observer} observer - 观察者对象
     * @public
     */

  }, {
    key: "detach",
    value: function detach(observer) {
      this.observers = this.observers.filter(function (o) {
        return o !== observer;
      });
    }
    /**
     * 获取状态
     * @return {Object}
     * @public
     */

  }, {
    key: "notify",

    /**
     * 通知观察者状态变化
     * @param {Object} prevState - 原状态
     * @private
     */
    value: function notify(prevState) {
      var _this = this;

      this.observers.forEach(function (o) {
        if ({}.hasOwnProperty.call(o, 'update')) {
          o.update(_this.state, prevState);
        }
      });
    }
  }, {
    key: "state",
    get: function get() {
      return Object.assign({}, this._state);
    }
    /**
     * 更新状态
     * @param {Object} newState - 更新状态
     * @public
     */
    ,
    set: function set(newState) {
      var prevState = Object.assign({}, this._state);
      this._state = Object.assign({}, prevState, newState);
      this.notify(prevState);
    }
  }]);

  return Subject;
}();

/**
 * @interface Util
 */

var Util =
/*#__PURE__*/
function () {
  function Util(group) {
    _classCallCheck(this, Util);

    /**
     * 实例分类，用于单页多实例间区分
     * @type string
     */
    this.group = group;
    /**
     * 被观察者实例
     * @type {Subject}
     */

    this.subject = new Subject();
  }
  /**
   * 查找最近父元素或当前元素
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill}
   * @param {Element} el - 子元素
   * @param {string} parent - 父元素选择器
   * @return {(Element|null)} 查找到的元素，无匹配返回null
   */


  _createClass(Util, [{
    key: "attach",

    /**
     * 为subject绑定observer
     * @param {(Observer|Array.<Observer>)} observer - 观察者对象
     * @return {number} 已绑定observer数量
     */
    value: function attach(observer) {
      var _this = this;

      var iterable = Array.isArray(observer) ? observer : [observer];
      iterable.forEach(function (o) {
        _this.subject.attach(o);
      });
      return this.subject.observers.length;
    }
    /**
     * 为subject移除observer
     * @param {(Observer|Array.<Observer>)} observer - 观察者对象
     * @return {number} 已绑定observer数量
     */

  }, {
    key: "detach",
    value: function detach(observer) {
      var _this2 = this;

      var iterable = Array.isArray(observer) ? observer : [observer];
      iterable.forEach(function (o) {
        _this2.subject.detach(o);
      });
      return this.subject.observers.length;
    }
  }], [{
    key: "closest",
    value: function closest(el, parent) {
      if (typeof el.closest === 'function') {
        return el.closest(parent);
      }

      var matches = Array.from((el.document || el.ownerDocument).querySelectorAll(parent));
      var node = el;
      var matchedArr = [];

      var cb = function cb(m) {
        return node === m;
      };

      do {
        matchedArr = matches.filter(cb);
      } while (matchedArr.length === 0 && (node = node.parentElement));

      return node;
    }
    /**
     * escape HTML
     * @see {@link https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406}
     * @param {string} unsafe - 需转义字符串
     * @return {string} 转义后字符串
     */

  }, {
    key: "escapeHtml",
    value: function escapeHtml(unsafe) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return unsafe.replace(/[&<>"']/g, function (m) {
        return map[m];
      });
    }
    /**
     * 元素是否在y轴可视范围内
     * @param {HTMLElement} item - 需要检测是否在可视范围的元素
     * @return {boolean}
     */

  }, {
    key: "inview",
    value: function inview(item) {
      var rect = item.getBoundingClientRect();
      var itemT = rect.top;
      var itemB = itemT + rect.height;
      return itemB > 0 && itemT < window.innerHeight;
    }
  }]);

  return Util;
}();

/**
 * 主区域(banner)观察者
 * @param {Element} main - Carousel组件主区域(banner)
 * @param {boolean} cssCustomProp - 浏览器环境是否支持css自定义参数
 * @return {Observer}
 */
var bannerObserver = function bannerObserver(main, cssCustomProp) {
  return {
    /**
     * banner切换，若不支持css自定义变量，直接修改transform属性
     * @param {Object} state - 状态
     * @param {number} state.focus - 聚焦页编号
     */
    update: function update(state) {
      var focus = state.focus;
      var offset = "".concat((1 - focus) * 100, "%");

      if (cssCustomProp) {
        main.style.setProperty('--banner-translateX', offset);
      } else {
        main.style.transform = "translate3d(".concat(offset, ", 0, 0)");
      }
    }
  };
};
/**
 * @ignore
 */


var base = (function (Base) {
  return (
    /*#__PURE__*/
    function (_Base) {
      _inherits(_class, _Base);

      /**
       * 新建Carousel实例
       */
      function _class() {
        var _this;

        var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, group));
        var query = ".carousel".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
        /**
         * Carousel组件容器
         * @type {Element}
         * @public
         */

        _this.carousel = document.querySelector(query);
        /**
         * Carousel组件banner区域
         * @type {Element}
         * @private
         */

        _this.main = _this.carousel.querySelector('.carousel__main');

        var slideBanner = _this.main.querySelectorAll('.slide-banner');
        /**
         * Carousel配置
         * @type {Object}
         * @property {number} focus - 初始聚焦页，没有上边界判断
         * @property {number} delay - 轮播延时
         * @property {number} length - 总页数
         * @property {boolean} supports - 是否支持css自定义属性
         * @desc 配置初始化后不应该被修改
         */


        _this.options = Object.assign({}, {
          focus: 1,
          delay: 8000,
          length: slideBanner ? slideBanner.length : 1
        }, opts, {
          supports: window.CSS && window.CSS.supports && window.CSS.supports('(--banner-translateX: 0%)')
        });
        Object.freeze(_this.options);
        /**
         * 定时器
         * @type {Number}
         * @ignore
         */

        _this.timeoutID = NaN;
        _this.play = _this.play.bind(_assertThisInitialized(_this)); // 添加主区域(banner)observer

        _this.attach(bannerObserver(_this.main, _this.options.supports));

        return _this;
      }
      /**
       * 当前聚焦页
       * @return {(number|undefined)}
       * @public
       */


      _createClass(_class, [{
        key: "setTimeout",

        /**
         * 轮播定时器
         * @param {function} cb - 延时处理函数
         * @ignore
         */
        value: function (_setTimeout) {
          function setTimeout(_x) {
            return _setTimeout.apply(this, arguments);
          }

          setTimeout.toString = function () {
            return _setTimeout.toString();
          };

          return setTimeout;
        }(function (cb) {
          this.timeoutID = setTimeout(cb, this.options.delay);
        })
        /**
         * 清理轮播定时器
         * @ignore
         */

      }, {
        key: "clearTimeout",
        value: function (_clearTimeout) {
          function clearTimeout() {
            return _clearTimeout.apply(this, arguments);
          }

          clearTimeout.toString = function () {
            return _clearTimeout.toString();
          };

          return clearTimeout;
        }(function () {
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = NaN;
          }
        })
        /**
         * 播放，实例化时虽然传入focus，但不默认聚焦；运行play时，若首次运行聚焦到focus，否则下一页
         * @param {boolean} reverse=false - 是否反向播放，反向指播放编号比当前图片小1的图片
         * @return {number} 下一页编号
         * @abstract
         * @ignore
         */

      }, {
        key: "play",
        value: function play() {
          var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var _options = this.options,
              focus = _options.focus,
              len = _options.length;
          var next = focus;

          if (this.focus) {
            if (reverse) {
              next = this.focus <= 1 ? len : this.focus - 1;
            } else {
              next = this.focus >= len ? 1 : this.focus + 1;
            }
          }

          return next;
        }
      }, {
        key: "focus",
        get: function get() {
          return this.subject.state.focus;
        }
      }]);

      return _class;
    }(Base)
  );
});

/**
 * 导航区域(nav)观察者
 * @param {Element} nav - Menu组件导航区域
 * @return {Observer}
 */

var navObserver = function navObserver(nav) {
  var btnActiveName = 'slide-nav--active';
  return {
    /**
     * nav样式切换
     * @param {Object} state - 状态
     * @param {number} state.focus - 聚焦页编号
     */
    update: function update(state) {
      var focus = state.focus;
      Array.from(nav.querySelectorAll('.slide-nav')).forEach(function (btn) {
        var order = Number(btn.dataset.order);

        if (order === focus) {
          btn.classList.add(btnActiveName);
        } else {
          btn.classList.remove(btnActiveName);
        }
      });
    }
  };
};
/**
 * @class
 * @description 新建Carousel实例，可自定义nav
 * @implements {carouselBase}
 * @implements {Util}
 */


var Carousel =
/*#__PURE__*/
function (_base) {
  _inherits(Carousel, _base);

  /**
   * @param {string} group='' - 组件分类
   * @param {Object} opts={} - Carousel配置
   * @param {number} [opts.focus=1] - 初始聚焦页，没有上边界判断
   * @param {number} [opts.delay=8000] - 轮播延时(ms)
   * @augments {carouselBase}
   */
  function Carousel() {
    var _this;

    var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Carousel);

    _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, group, opts));
    /**
     * 导航区域
     * @type {Element}
     * @public
     */

    _this.nav = _this.carousel.querySelector('.carousel__nav'); // 是否自动播放

    _this.isAutoplay = false; // 添加导航区域observer

    _this.attach(navObserver(_this.nav)); // 事件绑定


    _this.bind();

    return _this;
  }

  _createClass(Carousel, [{
    key: "bind",
    value: function bind() {
      var _this2 = this;

      this.nav.onclick = function (e) {
        e.preventDefault();
        var next = Number(e.target.dataset.order);

        if (next && next >= 1 && next <= _this2.options.length) {
          _this2.go(next);
        }
      };
    }
    /**
     * 播放指定页，若autoplay启动延时函数
     * @param {number} next - 下一页编号
     * @private
     */

  }, {
    key: "go",
    value: function go(next) {
      this.clearTimeout();
      this.subject.state = {
        focus: next
      };

      if (this.isAutoplay) {
        this.setTimeout(this.play);
      }
    }
    /**
     * 播放下一页
     * @param {boolean} reverse - 是否反向播放，反向指播放当前图片左侧的图片
     */

  }, {
    key: "play",
    value: function play(reverse) {
      var next = _get(Carousel.prototype.__proto__ || Object.getPrototypeOf(Carousel.prototype), "play", this).call(this, reverse);

      this.go(next);
    }
    /**
     * 自动播放，总是正向播放
     */

  }, {
    key: "autoplay",
    value: function autoplay() {
      this.isAutoplay = true; // 播放初始聚焦页

      this.play();
    }
    /**
     * 暂停自动播放
     */

  }, {
    key: "pause",
    value: function pause() {
      this.isAutoplay = false;
      this.clearTimeout();
    }
  }]);

  return Carousel;
}(base(Util));

/**
 * @class
 * @description Carousel精简版，仅自动轮播，无nav(包括自定义nav)
 * @implements {carouselBase}
 * @implements {Util}
 */

var CarouselLite =
/*#__PURE__*/
function (_base) {
  _inherits(CarouselLite, _base);

  function CarouselLite() {
    _classCallCheck(this, CarouselLite);

    return _possibleConstructorReturn(this, (CarouselLite.__proto__ || Object.getPrototypeOf(CarouselLite)).apply(this, arguments));
  }

  _createClass(CarouselLite, [{
    key: "play",

    /**
     * 自动播放
     */
    value: function play() {
      this.clearTimeout();

      var next = _get(CarouselLite.prototype.__proto__ || Object.getPrototypeOf(CarouselLite.prototype), "play", this).call(this);

      this.subject.state = {
        focus: next
      };
      this.setTimeout(this.play);
    }
    /**
     * 暂停自动播放
     * @public
     */

  }, {
    key: "pause",
    value: function pause() {
      this.clearTimeout();
    }
  }]);

  return CarouselLite;
}(base(Util));

var isEnum = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

// https://github.com/tc39/proposal-object-values-entries

var $entries = _objectToArray(true);

_export(_export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

var _library = false;

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$3 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$3
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) _redefine(target, key, src[key], safe);
  return target;
};

var def = _objectDp.f;

var TAG$1 = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability$1 = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability$1(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

/**
 * 异步操作默认状态
 * @type {Number}
 */
var PROCESS_PENDING = 0;
/**
 * 异步操作开始
 * @type {Number}
 */

var PROCESS_START = 1;
/**
 * 异步操作完成
 * @type {Number}
 */

var PROCESS_DONE = 2;
/**
 * 异步操作失败
 * @type {Number}
 */

var PROCESS_ERROR = -1;

/**
 * style观察者
 * @return {Observer}
 */

var styleObserver = function styleObserver() {
  var replace = 'replace';
  var done = 'done';
  var error = 'error';
  return {
    /**
     * 控制image-loader样式
     */
    update: function update(state) {
      var loader = state.loader,
          status = state.status;

      if (status === PROCESS_START) {
        // 立即将loader移出loaders
        loader.classList.remove(replace);
      } else if (status === PROCESS_DONE) {
        // 隐藏thumbnail
        loader.classList.add(done);
      } else if (status === PROCESS_ERROR) {
        loader.classList.add(error);
      }
    }
  };
};
/**
 * @class
 * @implements {Util}
 */


var ImageLoader =
/*#__PURE__*/
function (_Util) {
  _inherits(ImageLoader, _Util);

  _createClass(ImageLoader, null, [{
    key: "loadImage",

    /**
     * 加载图片
     * @param {HTMLElement} loader - 正在操作的loader
     * @private
     */
    value: function loadImage(loader) {
      var reserved = ['src', 'alt', 'crossorigin'];
      return new Promise(function (resolve, reject) {
        var img = new window.Image();
        img.classList.add('image', 'image--full');
        Object.entries(loader.dataset).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          if (reserved.includes(key)) {
            img[key] = val;
          } else {
            img.dataset[key] = val;
          }
        });

        img.onload = function (e) {
          resolve(e.target);
        };

        img.onerror = function () {
          reject(img.src);
        };
      });
    }
    /**
     * 新建Menu实例
     * @param {string} [group] - 组件分类
     * @augments {Util}
     */

  }]);

  function ImageLoader(group) {
    var _this;

    _classCallCheck(this, ImageLoader);

    _this = _possibleConstructorReturn(this, (ImageLoader.__proto__ || Object.getPrototypeOf(ImageLoader)).call(this, group));
    /**
     * 所有image-loader组件，live HTMLCollection
     * @type {HTMLCollection}
     * @public
     */

    _this.loaders = document.getElementsByClassName('image-loader replace'); // 添加默认observer

    _this.attach(styleObserver());

    return _this;
  }
  /**
   * loader加载成功
   * @param {HTMLElement} loader - 成功的loader
   * @param {HTMLImageElement} image - 写入的Image对象
   * @private
   */


  _createClass(ImageLoader, [{
    key: "done",
    value: function done(loader, image) {
      loader.appendChild(image);
      this.subject.state = {
        loader: loader,
        status: PROCESS_DONE
      };
    }
    /**
     * loader加载失败
     * @param {HTMLElement} loader - 失败的loader
     * @private
     */

  }, {
    key: "error",
    value: function error(loader) {
      this.subject.state = {
        loader: loader,
        status: PROCESS_ERROR
      };
    }
    /**
     * 延时加载，遍历loaders查找符合条件loader
     * @return {Promise}
     * @public
     */

  }, {
    key: "lazyload",
    value: function lazyload() {
      var _this2 = this;

      var loaders = Array.from(this.loaders).map(function (loader) {
        if (_this2.constructor.inview(loader)) {
          _this2.subject.state = {
            loader: loader,
            status: PROCESS_START
          };
          return _this2.constructor.loadImage(loader).then(function (image) {
            _this2.done(loader, image);

            return {
              src: image.src,
              done: true
            };
          }, function (src) {
            _this2.error(loader);

            return {
              src: src,
              error: true
            };
          });
        }

        return false;
      });
      return Promise.all(loaders);
    }
  }]);

  return ImageLoader;
}(Util);

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var SPECIES$2 = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
_export(_export.P + _export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

/**
 * mask观察者
 * @param {Element} mask - mask对象
 * @return {Observer}
 */

var maskObserver = function maskObserver(mask) {
  var activeName = 'mask--active';
  return {
    /**
     * mask样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     */
    update: function update(state) {
      if (state.hidden) {
        mask.classList.remove(activeName);
      } else {
        mask.classList.add(activeName);
      }
    }
  };
};
/**
 * panel观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */


var panelObserver = function panelObserver(panels) {
  var activeName = 'mask__panel--active';
  return {
    /**
     * penel样式切换
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     * @param {string} state.panel - 当期聚焦页
     */
    update: function update(state) {
      var hidden = state.hidden,
          panel = state.panel;
      var panelName = panel && "mask__panel--".concat(panel);
      panels.forEach(function (p) {
        if (hidden || !panelName || !p.classList.contains(panelName)) {
          p.classList.remove(activeName);
        } else {
          p.classList.add(activeName);
        }
      });
    }
  };
};
/**
 * 提示信息观察者
 * @param {Array.<Element>} panels - Mask组件panel区域
 * @return {Observer}
 */


var messageObserver = function messageObserver(panels) {
  return {
    /**
     * 写入提示信息，若没有message子元素暂时不做任何操作
     * @param {Object} state - 状态
     * @param {boolean} state.hidden - mask是否显示
     * @param {string} state.panel - 当期聚焦页
     * @param {string} state.message - 提示信息
     * @throws {Error} 不存在匹配元素.mask__penel--{name}
     */
    update: function update(state) {
      var hidden = state.hidden,
          panel = state.panel,
          message = state.message;
      var panelName = panel && "mask__panel--".concat(panel);
      var panelTarget = panelName && panels.find(function (p) {
        return p.classList.contains(panelName);
      });

      if (!hidden && panelName) {
        // 提供提示
        if (!panelTarget) {
          throw new Error("".concat(panelName, " not exists"));
        }

        var target = panelTarget.querySelector('.message');

        if (target) {
          target.innerHTML = message;
        }
      }
    }
  };
};
/**
 * @class
 * @implements {Util}
 */


var Mask =
/*#__PURE__*/
function (_Util) {
  _inherits(Mask, _Util);

  /**
   * 新建Mask实例
   * @param {string} [group] - 组件分类，区别单页中多个Mask组件，若单页仅一个Mask可忽略
   * @augments {Util}
   */
  function Mask(group) {
    var _this;

    _classCallCheck(this, Mask);

    _this = _possibleConstructorReturn(this, (Mask.__proto__ || Object.getPrototypeOf(Mask)).call(this, group));
    var query = ".mask".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
    /**
     * Mask组件容器
     * @type {Element}
     * @public
     */

    _this.mask = document.querySelector(query);
    /**
     * Mask组件panel区域
     * @type {Array.<Element>}
     * @private
     */

    _this.panels = Array.from(_this.mask.querySelectorAll('.mask__panel')); // 添加默认observer

    _this.attach([maskObserver(_this.mask), panelObserver(_this.panels), messageObserver(_this.panels)]);

    return _this;
  }
  /**
   * 提示信息
   * @param {string} name - panel名称，将查找.mask__penel--{name}
   * @param {*} [msg=''] - 提示信息，注意0等值
   */


  _createClass(Mask, [{
    key: "prompt",
    value: function prompt(name) {
      var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      this.subject.state = {
        hidden: false,
        panel: name,
        message: msg === null ? 'null' : this.constructor.escapeHtml(msg.toString())
      };
    }
    /**
     * loading效果
     */

  }, {
    key: "loading",
    value: function loading() {
      this.prompt('loading');
    }
    /**
     * 显示Mask，不显示任何panel
     */

  }, {
    key: "show",
    value: function show() {
      this.subject.state = {
        hidden: false,
        panel: '',
        message: ''
      };
    }
    /**
     * 隐藏Mask
     */

  }, {
    key: "hide",
    value: function hide() {
      this.subject.state = {
        hidden: true,
        panel: '',
        message: ''
      };
    }
  }]);

  return Mask;
}(Util);

/**
 * 导航区域观察者
 * @param {Array.<Element>} anchors - Menu组件导航区域
 * @return {Observer}
 */

var anchorsObserver = function anchorsObserver(anchors) {
  var activeName = 'menu__anchor--active';
  return {
    /**
     * 导航区域样式切换
     * @param {Object} state - 状态
     * @param {string} state.page - 当期聚焦页
     */
    update: function update(state) {
      var currentPage = state.page;
      anchors.forEach(function (anchor) {
        var page = anchor.dataset.page;

        if (page === currentPage) {
          anchor.classList.add(activeName);
        } else {
          anchor.classList.remove(activeName);
        }
      });
    }
  };
};
/**
 * @class
 * @implements {Util}
 */


var Menu =
/*#__PURE__*/
function (_Util) {
  _inherits(Menu, _Util);

  /**
   * 新建Menu实例
   * @param {string} [group] - 组件分类，区别单页中多个Menu组件，若单页仅一个Menu可忽略
   * @augments {Util}
   */
  function Menu(group) {
    var _this;

    _classCallCheck(this, Menu);

    _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, group));
    var query = ".menu".concat(_this.group ? "[data-group=\"".concat(_this.group, "\"]") : '');
    /**
     * Menu组件容器
     * @type {Element}
     * @public
     */

    _this.menu = document.querySelector(query);
    /**
     * Menu组件导航区域
     * @type {Array.<Element>}
     * @private
     */

    _this.anchors = Array.from(_this.menu.querySelectorAll('.menu__anchor')); // 添加默认observer

    _this.attach(anchorsObserver(_this.anchors));

    return _this;
  }
  /**
   * 打开指定页
   * @param {(number|string)} id - 页面id，通过设置anchor的data-page确定
   * @param {boolean} [fallback=false] - 无匹配id的anchor时是否使用fallback anchor，即第一个anchor
   * @throws {Error} 无匹配id的anchor且不使用fallback anchor时抛出错误
   */


  _createClass(Menu, [{
    key: "open",
    value: function open(id) {
      var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var target = this.anchors.find(function (anchor) {
        return anchor.dataset.page === id.toString();
      });

      if (!target && !fallback) {
        throw new Error("Menu: ".concat(id, " not exists"));
      }

      target = target || this.anchors[0];
      this.subject.state = Object.assign({}, target.dataset);
    }
    /**
     * 当前聚焦的page
     * @return {string}
     * @public
     */

  }, {
    key: "page",
    get: function get() {
      return this.subject.state.page || '';
    }
  }]);

  return Menu;
}(Util);

exports.Carousel = Carousel;
exports.CarouselLite = CarouselLite;
exports.ImageLoader = ImageLoader;
exports.Mask = Mask;
exports.Menu = Menu;
exports.PROCESS_PENDING = PROCESS_PENDING;
exports.PROCESS_START = PROCESS_START;
exports.PROCESS_DONE = PROCESS_DONE;
exports.PROCESS_ERROR = PROCESS_ERROR;
//# sourceMappingURL=index.cjs.js.map
