import chai from 'chai';
import sinon from 'sinon';
import Swipe from '../src/swipe';
import Group from '../src/group';

const { expect } = chai;

describe('Swipe', () => {
  describe('Basic', () => {
    it('Extends Group', () => {
      const swipe = new Swipe();

      expect(swipe).to.be.an.instanceof(Group);
    });

    it('unify, 静态方法, 统一定位时使用的对象', () => {
      const event = { clientX: 0, clientY: 0 };
      const touchEvent = { changedTouches: [ event ] };

      expect(Swipe.unify(event)).to.eql(event);
      expect(Swipe.unify(touchEvent)).to.eql(event);
    });

    it('dimention, 静态方法, 获取尺寸信息', () => {
      const {
        x0,
        y0,
        x1,
        y1,
      } = {
        x0: 1,
        y0: 20,
        x1: 16,
        y1: 11,
      };
      const result = {
        dx: 15,
        dy: -9,
        absDx: 15,
        absDy: 9,
      };

      expect(Swipe.dimention(x0, y0, x1, y1)).to.eql(result);
    });

    it('isEdge, 静态方法, 是否在边缘页且正在向空白部分滑动', () => {
      const length = 3;
      const pairs = [
        { focus: 1, dx: -1, isEdge: false },
        { focus: 1, dx: 0, isEdge: false },
        { focus: 1, dx: 1, isEdge: true },
        { focus: 2, dx: -1, isEdge: false },
        { focus: 2, dx: 0, isEdge: false },
        { focus: 2, dx: 1, isEdge: false },
        { focus: 3, dx: -1, isEdge: true },
        { focus: 3, dx: 0, isEdge: false },
        { focus: 3, dx: 1, isEdge: false },
      ];

      const result = pairs.map(({
        focus,
        dx,
        isEdge: compare,
      }) => [Swipe.isEdge(length, focus, dx), compare]);

      expect(result).to.satisfy(arr => arr.every(([d, r]) => d === r));
    });

    it('group, 不传入能初始化为main', () => {
      const swipe = new Swipe();

      expect(swipe.group).to.equal('main');
    });

    it('state, 初始化固定值', () => {
      const swipe = new Swipe();

      expect(swipe.state).to.eql({
        swipe: 'end',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
      });
    });
  });

  describe('Methods', () => {
    let swipe = null;

    const pos = {
      clientX: 5,
      clientY: 6,
    };

    beforeEach(() => {
      swipe = new Swipe('main');
    });

    it('dispatch, SWIPESTART事件调度', () => {
      const spyStart = sinon.spy(swipe, 'swipeStart');
      const spyMove = sinon.spy(swipe, 'swipeMove');
      const spyEnd = sinon.spy(swipe, 'swipeEnd');

      // 从start到start
      swipe.setState({ swipe: 'start' });
      swipe.dispatch('SWIPESTART')(pos);

      expect(spyStart.notCalled).to.be.true;
      expect(spyMove.notCalled).to.be.true;
      expect(spyEnd.notCalled).to.be.true;

      // 从move到start
      swipe.setState({ swipe: 'move' });
      swipe.dispatch('SWIPESTART')(pos);

      expect(spyStart.notCalled).to.be.true;
      expect(spyMove.notCalled).to.be.true;
      expect(spyEnd.notCalled).to.be.true;

      // 从end到start
      swipe.setState({ swipe: 'end' });
      swipe.dispatch('SWIPESTART')(pos);

      expect(spyStart.calledOnceWithExactly(pos)).to.be.true;
    });

    it('dispatch, SWIPEMOVE事件调度', () => {
      const spyStart = sinon.spy(swipe, 'swipeStart');
      const spyMove = sinon.spy(swipe, 'swipeMove');
      const spyEnd = sinon.spy(swipe, 'swipeEnd');

      // 从start到move
      swipe.setState({ swipe: 'start' });
      swipe.dispatch('SWIPEMOVE')(pos);

      expect(spyMove.calledOnceWithExactly(pos)).to.be.true;
      spyMove.resetHistory();

      // 从move到move
      swipe.setState({ swipe: 'move' });
      swipe.dispatch('SWIPEMOVE')(pos);

      expect(spyMove.calledOnceWithExactly(pos)).to.be.true;
      spyMove.resetHistory();

      // 从end到move
      swipe.setState({ swipe: 'end' });
      swipe.dispatch('SWIPEMOVE')(pos);

      expect(spyStart.notCalled).to.be.true;
      expect(spyMove.notCalled).to.be.true;
      expect(spyEnd.notCalled).to.be.true;
    });

    it('dispatch, SWIPEEND事件调度', () => {
      const spyStart = sinon.spy(swipe, 'swipeStart');
      const spyMove = sinon.spy(swipe, 'swipeMove');
      const spyEnd = sinon.spy(swipe, 'swipeEnd');

      // 从start到end
      swipe.setState({ swipe: 'start' });
      swipe.dispatch('SWIPEEND')(pos);

      expect(spyEnd.calledOnceWithExactly(pos)).to.be.true;
      spyEnd.resetHistory();

      // 从move到end
      swipe.setState({ swipe: 'move' });
      swipe.dispatch('SWIPEEND')(pos);

      expect(spyEnd.calledOnceWithExactly(pos)).to.be.true;
      spyEnd.resetHistory();

      // 从end到end
      swipe.setState({ swipe: 'end' });
      swipe.dispatch('SWIPEEND')(pos);

      expect(spyStart.notCalled).to.be.true;
      expect(spyMove.notCalled).to.be.true;
      expect(spyEnd.notCalled).to.be.true;
    });

    it('swipeStart, 滑动动作开始, 设置状态', () => {
      const { clientX, clientY } = pos;

      swipe.swipeStart(pos);

      const { x1, y1, ...result } = swipe.state;

      expect(result).to.eql({
        swipe: 'start',
        x0: clientX,
        y0: clientY,
      })
    });

    it('swipeMove, 滑动动作, 设置状态', () => {
      const { clientX, clientY } = pos;

      swipe.swipeMove(pos);

      const { x0, y0, ...result } = swipe.state;

      expect(result).to.eql({
        swipe: 'move',
        x1: clientX,
        y1: clientY,
      })
    });

    it('swipeEnd, 滑动动作结束, 设置状态', () => {
      const { clientX, clientY } = pos;

      swipe.swipeEnd(pos);

      const { x0, y0, ...result } = swipe.state;

      expect(result).to.eql({
        swipe: 'end',
        x1: clientX,
        y1: clientY,
      })
    });

    it('start, 开始滑动', () => {
      const spy = sinon.spy(swipe, 'dispatch');

      swipe.start(pos);
      spy.calledOnceWithExactly('SWIPESTART');
    })

    it('move, 开始滑动', () => {
      const spy = sinon.spy(swipe, 'dispatch');

      swipe.move(pos);
      spy.calledOnceWithExactly('SWIPEMOVE');
    })

    it('end, 开始滑动', () => {
      const spy = sinon.spy(swipe, 'dispatch');

      swipe.end(pos);
      spy.calledOnceWithExactly('SWIPEEND');
    })
  });
});
