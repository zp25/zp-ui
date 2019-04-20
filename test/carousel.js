import chai from 'chai';
import sinon from 'sinon';
import Carousel from '../src/carousel';
import Group from '../src/group';

const { expect } = chai;

describe('Carousel', () => {
  const opts = {
    length: 6,
    focus: 1,
    delay: 2000,
  };

  describe('Basic', () => {
    it('Extends Group', () => {
      const carousel = new Carousel();

      expect(carousel).to.be.an.instanceof(Group);
    });

    it('group, 不传入能初始化为main', () => {
      const carousel = new Carousel();

      expect(carousel.group).to.equal('main');
    });

    it('options, 不传入能初始化指定值', () => {
      const carousel = new Carousel();

      expect(carousel.options).to.eql({
        length: 1,
        focus: 1,
        delay: 8000,
      });
    });

    it('options, 传入Object可配置，且初始化后不可修改(freeze)', () => {
      const carousel = new Carousel('main', opts);

      expect(carousel.options).to.eql(opts);
      expect(Object.isFrozen(carousel._options)).to.be.true;
    });

    it('options, 传入非Object将抛出TypeError', () => {
      const str = () => { new Carousel('main', ''); };
      const nul = () => { new Carousel('main', null); };

      expect(str).to.throw(TypeError);
      expect(nul).to.throw(TypeError);
    });

    it('options, 不能直接修改options属性', () => {
      const carousel = new Carousel('main', opts);

      const result = () => { carousel.options = 'foo'; };
      expect(result).to.throw(TypeError);
    });

    it('state, 初始化focus为0', () => {
      const carousel = new Carousel();

      expect(carousel.state).to.eql({ focus: 0 });
    });

    it('focus, 获取state.focus', () => {
      const carousel = new Carousel();

      carousel.setState({ focus: 666 });
      expect(carousel.focus).to.equal(666);
    })

    it('focus, 总是返回数字', () => {
      const carousel = new Carousel();

      carousel.setState({ focus: 'str' });
      expect(carousel.focus).to.be.a('number');
    });

    it('默认关闭autoplay, 没有定时器', () => {
      const carousel = new Carousel();

      expect(carousel.isAutoplay).to.be.false;
      expect(carousel.timeoutID).to.be.NaN;
    });
  });

  describe('Methods', () => {
    let carousel = null;
    let clock = null;

    beforeEach(() => {
      clock = sinon.useFakeTimers();;

      carousel = new Carousel('main', opts);
    });

    afterEach(() => {
      clock.restore();
    });

    it('setAutoplay, 若关闭autoplay, 没有反应', () => {
      carousel.isAutoplay = false;
      carousel.timeoutID = NaN;

      carousel.setAutoplay();
      // 通过timeoutID判断, 下方play/autoplay做聚合测试
      expect(carousel.timeoutID).to.be.NaN;
    });

    it('setAutoplay, 若开启autoplay, 启动定时器', () => {
      carousel.isAutoplay = true;
      carousel.timeoutID = NaN;

      carousel.setAutoplay();
      expect(carousel.timeoutID).to.not.be.NaN;
    });

    it('clearAutoplay, 清理定时器', () => {
      carousel.timeoutID = 666;

      carousel.clearAutoplay();
      expect(carousel.timeoutID).to.be.NaN;
    });

    it('go, 接收可转换为数字的参数, 播放指定页，尝试启动自动播放', () => {
      const spy = sinon.spy();
      carousel.setAutoplay = spy;

      [1, 5].forEach((o) => {
        carousel.go(o);
        expect(carousel.focus).to.equal(o);
      });

      carousel.go('2');
      expect(carousel.focus).to.equal(2);

      expect(spy.callCount).to.equal(3);
    });

    it('go, 越界或参数不能转换为number总是播放默认页，尝试启动自动播放', () => {
      const spy = sinon.spy();
      carousel.setAutoplay = spy;

      const { length, focus } = opts;

      carousel.go(0);
      expect(carousel.focus).to.equal(focus);

      carousel.go(opts.length + 1);
      expect(carousel.focus).to.equal(focus);

      carousel.go('str');
      expect(carousel.focus).to.equal(focus);

      carousel.go(undefined);
      expect(carousel.focus).to.equal(focus);

      expect(spy.callCount).to.equal(4);
    });

    it('next, 获取下一页编号, 参数true逆序, 有越界处理', () => {
      const { length } = opts;

      carousel.go(1);
      expect(carousel.next()).to.equal(2);
      expect(carousel.next(true)).to.equal(length);

      carousel.go(2);
      expect(carousel.next()).to.equal(3);
      expect(carousel.next(true)).to.equal(1);

      carousel.go(length);
      expect(carousel.next()).to.equal(1);
      expect(carousel.next(true)).to.equal(length - 1);
    });

    it('next, 若首次运行(this.focus为0)，聚焦到默认页', () => {
      const { focus } = opts;

      // 首次运行不是通过go聚焦到0, go仅在carousel准备完毕后调用
      // carousel.go(0);
      expect(carousel.next()).to.equal(focus);
      expect(carousel.next(true)).to.equal(focus);
    });

    it('play, 默认正向播放下一页', () => {
      const { length } = opts;
      carousel.go(length - 1);

      carousel.play();
      expect(carousel.focus).to.equal(length);

      carousel.play();
      expect(carousel.focus).to.equal(1);
    });

    it('play, 传入true逆向播放', () => {
      const { length } = opts;
      carousel.go(2);

      carousel.play(true);
      expect(carousel.focus).to.equal(1);

      carousel.play(true);
      expect(carousel.focus).to.equal(length);
    })

    it('play, 传入数字将播放指定页', () => {
      const spy = sinon.spy();
      carousel.go = spy;

      const { length } = opts;

      carousel.play(1);
      carousel.play(3);
      carousel.play(length);

      expect(spy.firstCall.calledWithExactly(1)).to.be.true;
      expect(spy.secondCall.calledWithExactly(3)).to.be.true;
      expect(spy.thirdCall.calledWithExactly(length)).to.be.true;
    });

    it('autoplay, 开始自动播放, 并正向播放下一页', () => {
      const { length, delay } = opts;
      carousel.go(length - 1);

      // 调用即自动播放下一页
      carousel.autoplay();

      clock.tick(delay - 1);
      expect(carousel.focus).to.equal(length);

      clock.tick(1);
      expect(carousel.focus).to.equal(1);

      clock.tick(delay);
      expect(carousel.focus).to.equal(2);
    });

    it('pause, 暂停自动播放', () => {
      const { delay } = opts;

      carousel.autoplay();
      carousel.pause();

      clock.tick(delay);
      expect(carousel.focus).to.equal(1);

      clock.tick(delay);
      expect(carousel.focus).to.equal(1);
    });
  });
});
