import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import base from '../src/carousel/base';
import Carousel from '../src/carousel/index';
import CarouselLite from '../src/carousel/lite';
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
    <div class="carousel__nav">
      <a href="#slide" class="slide-nav" data-order="1"></a>
      <a href="#slide" class="slide-nav" data-order="2"></a>
      <a href="#slide" class="slide-nav" data-order="3"></a>
      <!-- 无效导航 -->
      <a href="#slide" class="slide-nav" data-order="10000"></a>
      <a href="#slide" class="slide-nav"></a>
    </div>
  </div>

  <div class="carousel" data-group="lite">
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

describe('CarouselBase', () => {
  const CarouselBase = base(Util);
  const opts = {
    focus: 1,
    delay: 5000,
  };

  let carouselBase = null;

  describe('Basic', () => {
    before(() => {
      carouselBase = new CarouselBase('main', opts);
    });

    it('Extends: Util', () => {
      carouselBase.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: carousel, 容器实例', () => {
      const wrapper = document.querySelector('.carousel');

      carouselBase.carousel.should.eql(wrapper);
    });

    it('Prop: main, banner容器', () => {
      const main = carouselBase.carousel.querySelector('.carousel__main');

      carouselBase.main.should.eql(main);
    });

    it('Prop: options, 配置，且初始化后不可修改(freeze)', () => {
      const length = carouselBase.main.querySelectorAll('.slide-banner').length;
      const supports = window.CSS && window.CSS.supports && window.CSS.supports('(--css-prop: 0)');

      const result = Object.assign(opts, {
        length,
        supports,
      });

      carouselBase.options.should.eql(result);
      Object.isFrozen(carouselBase.options).should.be.true;
    });

    it('Prop: state, 存储实例状态', () => {
      carouselBase.should.have.ownProperty('state');
    });

    it('Prop: focus, 可获取当前聚焦页', () => {
      (carouselBase.focus === undefined).should.be.true;

      carouselBase.subject.state = {
        focus: 3,
      };

      carouselBase.focus.should.equal(3);
    });
  });

  describe('Methods', () => {
    const startEvent = { clientX: 0, clientY: 0 };

    before(() => {
      carouselBase = new CarouselBase('main', opts);
    });

    it('Static: unify, 统一定位时使用的对象', () => {
      const event = { clientX: 0, clientY: 0 };
      const touchEvent = { changedTouches: [ event ] };

      [
        CarouselBase.unify(event) === event,
        CarouselBase.unify(touchEvent) === event,
      ].should.eql([ true, true ]);
    });

    it('Static: isEdge, 是否在边缘页且正在向空白部分滑动', () => {
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

      const result = pairs.map((d) => {
        carouselBase.subject.state = {
          focus: d.focus,
        };

        return CarouselBase.isEdge(d.dx) === d.isEdge;
      });

      result.every(d => d === true);
    });

    it('swipeStart, 滑动动作开始，设置定位信息和移除动画', () => {
      const event = { clientX: 5, clientY: 6 };

      carouselBase.swipeStart(event);

      const { lock, x0, y0 } = carouselBase.state;

      ({ lock, x0, y0 }).should.be.eql({
        lock: true,
        x0: event.clientX,
        y0: event.clientY,
      });

      carouselBase.main.classList.contains('carousel__main--swipe').should.be.true;
    });

    it('swipeMove, 滑动动作，水平夹角45deg内(含45deg)有效', () => {
      const moveEvents = {
        left: { clientX: -5, clientY: 0 },
        bypass: { clientX: -5, clientY: -6 },
      };

      carouselBase.subject.state = { focus: 1 };
      carouselBase.swipeStart(startEvent);

      carouselBase.swipeMove(moveEvents.left).should.equal(-5);
      (carouselBase.swipeMove(moveEvents.bypass) === undefined).should.be.true;

      // 阻力效果未测试

      carouselBase.state.lock = false;
      (carouselBase.swipeMove(moveEvents.left) === undefined).should.be.true;
    });

    it('swipeEnd, 滑动动作结束，水平夹角45deg内(含45deg)有效，有总宽度0.1的滑动阈值', () => {
      carouselBase.state.offsetWidth = 375;

      const endEvents = {
        short: { clientX: -37, clientY: 0 },
        left: { clientX: -37.5, clientY: 0 },
        bypass: { clientX: -37.5, clientY: 50 },
      };

      carouselBase.subject.state = { focus: 1 };

      carouselBase.swipeStart(startEvent);
      carouselBase.swipeEnd(endEvents.short).should.equal(0);

      carouselBase.swipeStart(startEvent);
      carouselBase.swipeEnd(endEvents.left).should.eql({
        sign: -1,
        duration: 0.9,
      });

      carouselBase.swipeStart(startEvent);
      carouselBase.swipeEnd(endEvents.bypass).should.equal(0);

      (carouselBase.swipeEnd(endEvents.left) === undefined).should.be.true;
    });

    it('swipeEnd, 滑动动作结束，重置由swipeStart设置的定位信息和动画', () => {
      carouselBase.subject.state = { focus: 1 };

      carouselBase.swipeStart(startEvent);
      carouselBase.swipeEnd(startEvent);

      const { lock, x0, y0 } = carouselBase.state;

      ({ lock, x0, y0 }).should.be.eql({
        lock: false,
        x0: undefined,
        y0: undefined,
      });

      carouselBase.main.classList.contains('carousel__main--swipe').should.be.false;
    });

    it('setTimeout, 轮播定时器', () => {
      const clock = sinon.useFakeTimers();
      const spy = sinon.spy();

      carouselBase.setTimeout(spy);

      clock.tick(opts.delay);
      spy.calledOnce.should.be.true;

      clock.restore();
    });

    it('clearTimeout, 清理轮播定时器', () => {
      const clock = sinon.useFakeTimers();
      const spy = sinon.spy();

      carouselBase.setTimeout(spy);
      carouselBase.clearTimeout();

      clock.tick(opts.delay);
      spy.notCalled.should.be.true;

      clock.restore();
    });

    it('next, 获取下一播放页编号，', () => {
      carouselBase.subject.state = { focus: 1 };
      carouselBase.next().should.equal(2);
      carouselBase.next(true).should.equal(3);

      carouselBase.subject.state = { focus: 2 };
      carouselBase.next().should.equal(3);
      carouselBase.next(true).should.equal(1);

      carouselBase.subject.state = { focus: 3 };
      carouselBase.next().should.equal(1);
      carouselBase.next(true).should.equal(2);

      carouselBase.subject.state = { focus: undefined };
      carouselBase.next().should.equal(opts.focus);
    });
  });
});

describe('CarouselLite', () => {
  describe('Methods', () => {
    let carouselLite = null;

    const opts = {
      focus: 1,
      delay: 5000,
    };
    const startEvent = { clientX: 0, clientY: 0 };

    const clock = sinon.useFakeTimers();
    const spySetProperty = sinon.spy();;

    before(() => {
      carouselLite = new CarouselLite('lite', opts);

      carouselLite.main.style.setProperty = spySetProperty;
    });

    beforeEach(() => {
      carouselLite.subject.state = { focus: 1 };
    });

    afterEach(() => {
      spySetProperty.resetHistory();
    });

    after(() => {
      clock.restore();
    });

    it('swipeMove, 设置--banner-dx', () => {
      carouselLite.swipeStart(startEvent);
      carouselLite.swipeMove({ clientX: -5, clientY: 0 });

      spySetProperty.calledWithExactly(PROP_DX, '-5px').should.be.true;
    });

    it('swipeEnd, 滑动动作结束，设置动画效果，完成页面切换', () => {
      carouselLite.state.offsetWidth = 375;

      const endEvent = { clientX: -37.5, clientY: 0 };

      carouselLite.swipeStart(startEvent);
      carouselLite.swipeEnd(endEvent);

      spySetProperty.calledWithExactly(PROP_DX, '0px').should.be.true;
      spySetProperty.calledWithExactly(PROP_DURATION, 0.9).should.be.true;

      carouselLite.focus.should.equal(2);
    });

    it('play, 开始自动播放', () => {
      const { delay } = opts;

      carouselLite.play();

      clock.tick(delay - 1);
      carouselLite.focus.should.equal(2);

      clock.tick(1);
      carouselLite.focus.should.equal(3);

      clock.tick(delay);
      carouselLite.focus.should.equal(1);
    });

    it('pause, 暂停自动播放', () => {
      const { delay } = opts;

      carouselLite.play();
      carouselLite.pause();

      clock.tick(delay);
      carouselLite.focus.should.equal(2);

      clock.tick(delay);
      carouselLite.focus.should.equal(2);
    });
  });
});

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

    it('Prop: state, 包含isAutoplay属性', () => {
      carousel.state.should.have.ownProperty('isAutoplay');
    });
  });

  describe('Methods', () => {
    let carousel = null;
    let clock = null;

    const opts = {
      focus: 1,
      delay: 5000,
    };
    const startEvent = { clientX: 0, clientY: 0 };

    beforeEach(() => {
      clock = sinon.useFakeTimers();;

      carousel = new Carousel('main', opts);
    });

    afterEach(() => {
      clock.restore();
    });

    it('play, 播放下一页', () => {
      const order = [1, 2, 3, 1];

      order.forEach((o) => {
        carousel.play();
        carousel.focus.should.equal(o);
      });
    });

    it('play, 第一个参数传入true，播放上一页', () => {
      const order = [1, 3, 2, 1];

      order.forEach((o) => {
        carousel.play(true);
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

    it('bind, 导航能正确切换', () => {
      const order = [3, 1, 2];

      order.forEach((o) => {
        const query = `.slide-nav[data-order="${o}"]`;
        carousel.nav.querySelector(query).click();

        carousel.focus.should.equal(o);
      });
    });

    it('bind, 无匹配order将无效', () => {
      const order = 1;
      carousel.nav.querySelector(`.slide-nav[data-order="${order}"]`).click();

      carousel.nav.querySelector('.slide-nav:not([data-order])').click();
      carousel.focus.should.equal(order);

      carousel.nav.querySelector('.slide-nav[data-order="10000"]').click();
      carousel.focus.should.equal(order);
    });
  });
});
