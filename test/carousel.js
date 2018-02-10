import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import Carousel from '../src/carousel/index';
import CarouselLite from '../src/carousel/lite';
import Util from '../src/util';

chai.should();

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="app">
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
  </div>
</body>
</html>
`;

describe('Carousel', () => {
  describe('Basic', () => {
    let carousel = null;
    const opts = {
      focus: 3,
      delay: 5000,
    };

    before(() => {
      const window = new JSDOM(domStr).window;

      global.window = window;
      global.document = window.document;

      carousel = new Carousel('main', opts);
    });

    it('Extends: Util', () => {
      carousel.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: carousel, 容器实例', () => {
      const target = document.querySelector('.carousel');

      carousel.carousel.should.be.eql(target);
    });

    it('Prop: options, 配置，且不可修改(freeze)', () => {
      const result = Object.assign(opts, {
        length: carousel.main.querySelectorAll('.slide-banner').length,
        supports: (
          window.CSS && window.CSS.supports && window.CSS.supports('(--banner-translateX: 0%)')
        ),
      });

      carousel.options.should.be.eql(result);
      Object.isFrozen(carousel.options).should.be.true;
    });

    it('Getter: focus, 当前聚焦页', () => {
      (carousel.focus === undefined).should.be.true;

      const order = [3, 1, 2];

      order.forEach((o) => {
        carousel.go(o);
        carousel.focus.should.be.equal(o);
      });
    });
  });

  describe('Methods', () => {
    let carousel = null;
    let clock = null;

    const opts = {
      focus: 1,
      delay: 5000,
    };

    before(() => {
      const window = new JSDOM(domStr).window;

      global.window = window;
      global.document = window.document;

      // fake time
      clock = sinon.useFakeTimers();

      carousel = new Carousel('main', opts);
    });

    after(() => {
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
      const order = [3, 2, 1, 3];

      order.forEach((o) => {
        carousel.play(true);
        carousel.focus.should.equal(o);
      });
    });

    it('autoplay, 开始自动播放', () => {
      carousel.autoplay();

      clock.tick(opts.delay - 1);
      carousel.focus.should.equal(1);

      clock.tick(1);
      carousel.focus.should.equal(2);

      clock.tick(opts.delay);
      carousel.focus.should.equal(3);

      clock.tick(opts.delay);
      carousel.focus.should.equal(1);
    });

    it('pause, 暂停自动播放', () => {
      carousel.pause();

      clock.tick(opts.delay);
      carousel.focus.should.equal(1);

      clock.tick(opts.delay);
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

describe('CarouselLite', () => {
  describe('Methods', () => {
    let carouselLite = null;
    let clock = null;

    const opts = {
      focus: 1,
      delay: 5000,
    };

    before(() => {
      const window = new JSDOM(domStr).window;

      global.window = window;
      global.document = window.document;

      // fake time
      clock = sinon.useFakeTimers();

      carouselLite = new CarouselLite('lite', opts);
    });

    after(() => {
      clock.restore();
    });

    it('play, 开始自动播放', () => {
      const { delay } = opts;

      carouselLite.play();

      clock.tick(delay - 1);
      carouselLite.focus.should.equal(1);

      clock.tick(1);
      carouselLite.focus.should.equal(2);

      clock.tick(delay);
      carouselLite.focus.should.equal(3);

      clock.tick(delay);
      carouselLite.focus.should.equal(1);
    });

    it('pause, 暂停自动播放', () => {
      const { delay } = opts;

      carouselLite.pause();

      clock.tick(delay);
      carouselLite.focus.should.equal(1);

      clock.tick(delay);
      carouselLite.focus.should.equal(1);
    });
  });
});
