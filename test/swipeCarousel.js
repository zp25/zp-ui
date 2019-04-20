import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import SwipeCarousel from '../src/swipeCarousel';
import Carousel from '../src/carousel';
import Swipe from '../src/swipe';

const { expect } = chai;

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="carousel" data-group="fail"></div>

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

describe('SwipeCarousel', () => {
  before(() => {
    const window = new JSDOM(domStr).window;

    global.window = window;
    global.document = window.document;
  });

  it('Extends Carousel', () => {
    const carousel = new SwipeCarousel('main');

    expect(carousel).to.be.an.instanceof(Carousel);
  });

  it('若无匹配carousel容器, 抛出错误', () => {
    const fail = () => { new SwipeCarousel('empty'); };

    expect(fail).to.throw(Error);
  });

  it('若无匹配banner容器, 抛出错误', () => {
    const fail = () => { new SwipeCarousel('fail'); };

    expect(fail).to.throw(Error);
  });

  it('carousel, 获取容器', () => {
    const target = document.querySelector('.carousel[data-group="main"]');
    const carousel = new SwipeCarousel('main');

    expect(carousel.carousel).to.eql(target);
  });

  it('main, 获取banner容器', () => {
    const target = document.querySelector('.carousel__main');
    const carousel = new SwipeCarousel('main');

    expect(carousel.main).to.eql(target);
  });

  it('length, 返回banner长度', () => {
    const carousel = new SwipeCarousel('main');

    expect(carousel.length).to.equal(3);
  });

  it('swipe, Swipe实例', () => {
    const carousel = new SwipeCarousel('main');

    expect(carousel.swipe).to.be.an.instanceof(Swipe);
  });
});
