import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import Carousel from '../src/carousel';
import Util from '../src/util';
import {
  PROP_DX,
  PROP_DURATION,
} from '../constants';

chai.should();

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="carousel" data-group="main">
    <div class="carousel__main">
      <div class="slide-banner"></div>
      <div class="slide-banner"></div>
      <div class="slide-banner"></div>
    </div>
  </div>
</body>
</html>
`;

const window = new JSDOM(domStr).window;

global.window = window;
global.document = window.document;

describe('Carousel', () => {
  describe('Basic', () => {
    let carousel = null;
    const opts = {
      focus: 3,
      delay: 5000,
    };

    before(() => {
      carousel = new Carousel('main', opts);
    });

    it('Extends: Util', () => {
      carousel.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: carousel, 容器实例', () => {
      const wrapper = document.querySelector('.carousel');

      carousel.carousel.should.eql(wrapper);
    });

    it('Prop: main, banner容器', () => {
      const main = carousel.carousel.querySelector('.carousel__main');

      carousel.main.should.eql(main);
    });

    it('Prop: options, 配置，且初始化后不可修改(freeze)', () => {
      const length = carousel.main.querySelectorAll('.slide-banner').length;
      const supports = window.CSS && window.CSS.supports && window.CSS.supports('(--css-prop: 0)');

      const result = Object.assign(opts, {
        length,
        supports,
      });

      carousel.options.should.eql(result);
      Object.isFrozen(carousel.options).should.be.true;
    });

    it('Prop: state, 存储实例状态', () => {
      carousel.should.have.ownProperty('state');
    });

    it('Prop: timeoutID, 存储定时器', () => {
      carousel.should.have.ownProperty('timeoutID');
    });

    it('Prop: focus, 可获取当前聚焦页', () => {
      (carousel.focus === undefined).should.be.true;

      carousel.subject.state = {
        focus: 3,
      };

      carousel.focus.should.equal(3);
    });
  });

  describe('Static', () => {
    it('unify, 统一定位时使用的对象', () => {
      const event = { clientX: 0, clientY: 0 };
      const touchEvent = { changedTouches: [ event ] };

      Carousel.unify(event).should.eql(event);
      Carousel.unify(touchEvent).should.eql(event);
    });

    it('dimention, 获取尺寸信息', () => {
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

      Carousel.dimention(x0, y0, x1, y1).should.eql(result);
    });

    it('isEdge, 是否在边缘页且正在向空白部分滑动', () => {
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

      const result = pairs.map(d => (
        Carousel.isEdge(length, d.focus, d.dx) === d.isEdge
      ));

      result.every(d => d === true);
    });
  });

  describe('Methods', () => {
    let carousel = null;
    let clock = null;

    const opts = {
      focus: 1,
      delay: 5000,
    };
    const startPos = { clientX: 0, clientY: 0 };

    beforeEach(() => {
      clock = sinon.useFakeTimers();;

      carousel = new Carousel('main', opts);
    });

    afterEach(() => {
      clock.restore();
    });

    it('dispatch, 事件调度，测了状态机', () => {
      const event = { clientX: 5, clientY: 6 };

      const spyStart = sinon.spy(carousel, 'swipeStart');
      const spyMove = sinon.spy(carousel, 'swipeMove');
      const spyEnd = sinon.spy(carousel, 'swipeEnd');

      // start
      carousel.state.swipe = 'end';
      carousel.dispatch('SWIPESTART')(event);

      spyStart.calledWithExactly(event);
      spyMove.notCalled.should.be.true;
      spyEnd.notCalled.should.be.true;

      spyStart.resetHistory();
      spyMove.resetHistory();
      spyEnd.resetHistory();

      // move
      carousel.state.swipe = 'start';
      carousel.dispatch('SWIPEMOVE')(event);

      carousel.state.swipe = 'move';
      carousel.dispatch('SWIPEMOVE')(event);

      spyMove.calledTwice.should.be.true;
      spyMove.firstCall.calledWithExactly(event);
      spyMove.secondCall.calledWithExactly(event);

      spyStart.notCalled.should.be.true;
      spyEnd.notCalled.should.be.true;

      spyStart.resetHistory();
      spyMove.resetHistory();
      spyEnd.resetHistory();

      // end
      carousel.state.swipe = 'start';
      carousel.dispatch('SWIPEEND')(event);

      carousel.state.swipe = 'move';
      carousel.dispatch('SWIPEEND')(event);

      spyEnd.calledTwice.should.be.true;
      spyEnd.firstCall.calledWithExactly(event);
      spyEnd.secondCall.calledWithExactly(event);

      spyStart.notCalled.should.be.true;
      spyMove.notCalled.should.be.true;

      spyStart.resetHistory();
      spyMove.resetHistory();
      spyEnd.resetHistory();
    });

    it('swipeStart, 滑动动作开始，清理自动播放，修改样式', () => {
      const pos = { clientX: 5, clientY: 6 };

      carousel.swipeStart(pos);

      const {
        swipe,
        x0,
        y0,
      } = carousel.state;

      // 清理自动播放
      Number.isNaN(carousel.timeoutID).should.be.true;
      // 更新状态
      ({ swipe, x0, y0 }).should.eql({
        swipe: 'start',
        x0: pos.clientX,
        y0: pos.clientY,
      });
      // 修改样式
      carousel.main.classList.contains('carousel__main--swipe').should.be.true;
    });

    it('swipeMove, 滑动动作，水平夹角45deg内(含)有效', () => {
      const movePos = {
        left: { clientX: -5, clientY: 0 },
        bypass: { clientX: -5, clientY: -6 },
      };

      carousel.subject.state = { focus: 1 };
      carousel.swipeStart(startPos);

      carousel.swipeMove(movePos.left).should.equal(-5);
      (carousel.swipeMove(movePos.bypass) === undefined).should.be.true;

      carousel.state.swipe.should.equal('move');

      // 阻力效果未测试
    });

    it('swipeEnd, 滑动动作结束，水平夹角45deg内(含)有效，有总宽度0.1的滑动阈值，返回0不播放，1播放', () => {
      sinon.stub(carousel, 'offsetWidth').get(() => 375);

      const endPos = {
        short: { clientX: -37, clientY: 0 },
        left: { clientX: -37.5, clientY: 0 },
        bypass: { clientX: -37.5, clientY: 50 },
      };

      carousel.subject.state = { focus: 1 };

      carousel.swipeStart(startPos);
      carousel.swipeEnd(endPos.short).should.equal(0);

      carousel.swipeStart(startPos);
      carousel.swipeEnd(endPos.left).should.eql(1);

      carousel.swipeStart(startPos);
      carousel.swipeEnd(endPos.bypass).should.eql(0);
    });

    it('swipeEnd, 滑动动作结束，重置由swipeStart设置的定位信息和动画', () => {
      carousel.subject.state = { focus: 1 };

      carousel.swipeStart(startPos);
      carousel.swipeEnd(startPos);

      const { swipe, x0, y0 } = carousel.state;

      ({ swipe, x0, y0 }).should.be.eql({
        swipe: 'end',
        x0: 0,
        y0: 0,
      });

      carousel.main.classList.contains('carousel__main--swipe').should.be.false;
    });

    it('setAutoplay, 初始化自动播放', () => {
      const spy = sinon.spy(carousel, 'play');

      carousel.state.isAutoplay = false;
      carousel.setAutoplay();

      clock.tick(opts.delay);
      spy.notCalled.should.be.true;

      carousel.state.isAutoplay = true;
      carousel.setAutoplay();

      clock.tick(opts.delay);
      spy.calledOnce.should.be.true;
    });

    it('clearAutoplay, 清理自动播放', () => {
      const spy = sinon.spy(carousel, 'play');

      carousel.state.isAutoplay = true;
      carousel.setAutoplay();

      carousel.clearAutoplay();

      clock.tick(opts.delay);
      spy.notCalled.should.be.true;
    });

    it('go, 播放指定页，尝试启动自动播放', () => {
      const spy = sinon.spy(carousel, 'setAutoplay');

      [1, 3, 2].forEach((o) => {
        carousel.go(o);
        carousel.focus.should.equal(o);
      });

      // 越界总是播放默认页
      carousel.go(0);
      carousel.focus.should.equal(opts.focus);
      carousel.go(opts.length + 1);
      carousel.focus.should.equal(opts.focus);

      spy.callCount.should.equal(5);
    });

    it('next, 获取下一播放页编号，若首次运行(this.focus空)，聚焦到this.options.focus', () => {
      carousel.go(1);
      carousel.next().should.equal(2);
      carousel.next(true).should.equal(3);

      carousel.go(2);
      carousel.next().should.equal(3);
      carousel.next(true).should.equal(1);

      carousel.go(3);
      carousel.next().should.equal(1);
      carousel.next(true).should.equal(2);

      carousel.subject.state = { focus: undefined };
      carousel.next().should.equal(opts.focus);
      carousel.next(true).should.equal(opts.focus);
    });

    it('play, 播放下一页', () => {
      // 正向按序播放
      carousel.go(1);

      [2, 3, 1].forEach((o) => {
        carousel.play();
        carousel.focus.should.equal(o);
      });

      // 逆向按序播放
      carousel.go(1);

      [3, 2, 1].forEach((o) => {
        carousel.play(true);
        carousel.focus.should.equal(o);
      });

      // 指定播放
      [1, 2, 3].forEach((o) => {
        carousel.play(o);
        carousel.focus.should.equal(o);
      });
    });

    it('autoplay, 开始自动播放', () => {
      const { delay } = opts;

      carousel.autoplay();

      clock.tick(delay - 1);
      carousel.focus.should.equal(1);

      clock.tick(1);
      carousel.focus.should.equal(2);

      clock.tick(delay);
      carousel.focus.should.equal(3);

      clock.tick(delay);
      carousel.focus.should.equal(1);
    });

    it('pause, 暂停自动播放', () => {
      const { delay } = opts;

      carousel.autoplay();
      carousel.pause();

      clock.tick(delay);
      carousel.focus.should.equal(1);

      clock.tick(delay);
      carousel.focus.should.equal(1);
    });
  });
});
