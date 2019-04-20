/**
 * @typedef {Object} Dimention
 * @property {number} dx - x轴方向移动距离
 * @property {number} dy - y轴方向移动距离
 * @property {number} absDx - x轴方向移动距离绝对值
 * @property {number} absDy - y轴方向移动距离绝对值
 */

/**
 * @typedef {Object} Position
 * @property {number} clientX
 * @property {number} clientY
 */

import { machine } from 'zp-lib';
import Group from './group';

/**
 * 滑动动作状态查询字典
 * @type {Object}
 * @ignore
 */
const SwipeDict = {
  start: {
    SWIPEMOVE: 'move',
    SWIPEEND: 'end',
  },
  move: {
    SWIPEMOVE: 'move',
    SWIPEEND: 'end',
  },
  end: {
    SWIPESTART: 'start',
  },
};

// 添加状态机
const swipeMachine = machine(SwipeDict);

/**
 * @class
 * @implements {Group}
 */
class Swipe extends Group {
  /**
   * 统一定位时使用的对象
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @return {(MouseEvent|Touch)}
   * @public
   */
  static unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  /**
   * 获取尺寸信息
   * @return {Dimention} 尺寸信息
   * @public
   */
  static dimention(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    return {
      dx,
      dy,
      absDx: Math.abs(dx),
      absDy: Math.abs(dy),
    };
  }

  /**
   * 是否在边缘页且正在向空白部分滑动
   * @param {number} length - 总页数
   * @param {number} focus - 当前聚焦页编号
   * @param {number} dx - 水平方向移动距离
   * @return {boolean}
   * @public
   */
  static isEdge(length, focus, dx) {
    return (focus === 1 && dx > 0) || (focus === length && dx < 0);
  }

  constructor(group = 'main') {
    super(group);

    /**
     * 状态
     * @type {Object}
     * @property {string} swipe - swipe当前状态
     * @property {number} x0 - swipe起始x坐标
     * @property {number} y0 - swipe起始y坐标
     * @property {number} x1 - swipe当前/结束x坐标
     * @property {number} y1 - swipe当前/结束y坐标
     */
    this.state = {
      swipe: 'end',
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
    };
  }

  /**
   * 事件调度
   * @description 绑定fsm和对象实例，依照fsm信息完成匹配动作
   * @param {string} action - fsm输入
   * @return {Function}
   * @private
   */
  dispatch(action) {
    /**
     * @param {(MouseEvent|TouchEvent)} e - 事件对象
     * @ignore
     */
    return (e) => {
      const {
        clientX,
        clientY,
      } = this.constructor.unify(e);
      const pos = {
        clientX,
        clientY,
      };

      const { swipe: currentState } = this.state;
      const nextState = swipeMachine(currentState)(action);

      if (nextState === 'start') {
        this.swipeStart(pos);
      } else if (nextState === 'move') {
        this.swipeMove(pos);
      } else if (nextState === 'end') {
        this.swipeEnd(pos);
      }
    };
  }

  /**
   * 滑动动作开始
   * @param {Position} pos - 位置信息
   * @protected
   * @ignore
   */
  swipeStart(pos) {
    const {
      clientX: x0,
      clientY: y0,
    } = pos;

    this.setState({
      swipe: 'start',
      x0,
      y0,
    });
  }

  /**
   * 滑动动作
   * @param {Position} pos - 位置信息
   * @protected
   * @ignore
   */
  swipeMove(pos) {
    const {
      clientX: x1,
      clientY: y1,
    } = pos;

    this.setState({
      swipe: 'move',
      x1,
      y1,
    });
  }

  /**
   * 滑动动作结束
   * @param {Position} pos - 位置信息
   * @protected
   * @ignore
   */
  swipeEnd(pos) {
    const {
      clientX: x1,
      clientY: y1,
    } = pos;

    this.setState({
      swipe: 'end',
      x1,
      y1,
    });
  }

  /**
   * 触发SWIPESTART事件
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @public
   */
  start(e) {
    this.dispatch('SWIPESTART')(e);
  }

  /**
   * 触发SWIPEMOVE事件
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @public
   */
  move(e) {
    this.dispatch('SWIPEMOVE')(e);
  }

  /**
   * 触发SWIPEEND事件
   * @param {(MouseEvent|TouchEvent)} e - 事件对象
   * @public
   */
  end(e) {
    this.dispatch('SWIPEEND')(e);
  }
}

export default Swipe;
