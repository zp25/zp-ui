import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import ImageLoader, { styleObserver } from '../src/imageLoader';
import Group from '../src/group';
import {
  PROCESS_START,
  PROCESS_DONE,
  PROCESS_ERROR,
} from '../constants';

const { expect } = chai;

describe('styleObserver', function() {
  const opts = {
    replace: 'replace',
    done: 'done',
    error: 'error',
  };

  before(function() {
    this.spyAdd = sinon.spy();
    this.spyRemove = sinon.spy();

    const loader = {
      classList: {
        add: this.spyAdd,
        remove: this.spyRemove,
      },
    };

    this.stateStart = {
      loader,
      status: PROCESS_START,
    };

    this.stateDone = {
      loader,
      status: PROCESS_DONE,
    };

    this.stateError = {
      loader,
      status: PROCESS_ERROR,
    };
  });

  afterEach(function() {
    this.spyAdd.resetHistory();
    this.spyRemove.resetHistory();
  });

  it('start时删除replace类', function() {
    const { replace } = opts;

    const observer = styleObserver(opts);
    observer.update(this.stateStart);

    expect(this.spyRemove.calledOnceWithExactly(replace)).to.be.true;
  });

  it('done时添加done类', function() {
    const { done } = opts;

    const observer = styleObserver(opts);
    observer.update(this.stateDone);

    expect(this.spyAdd.calledOnceWithExactly(done)).to.be.true;
  });


  it('start时删除replace类', function() {
    const { error } = opts;

    const observer = styleObserver(opts);
    observer.update(this.stateError);

    expect(this.spyAdd.calledOnceWithExactly(error)).to.be.true;
  });
});

/**
 * @see {@link https://gist.github.com/jakearchibald/6c43d5c454bc8f48f83d8471f45698fa}
 */
const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
const tmpImageLoader = `
  <div
    class="image-loader integration replace"
    data-src="fake.image"
    data-group="integration"
  >
    <img src="fake_preview.jpg" alt="fake image" class="image image--thumbnail">
  </div>
`;

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div id="app">
    <div
      class="image-loader loader replace"
      data-src="${webpData}"
      data-group="loader"
    >
      <img src="fake_preview.jpg" alt="fake image" class="image image--thumbnail">
    </div>

    <div
      class="image-loader fail replace"
      data-src="${webpData}"
      data-group="fail"
    >
      <img src="fake_preview.jpg" alt="fake image" class="image image--thumbnail">
    </div>

    ${tmpImageLoader}
  </div>
</body>
</html>
`;

describe('ImageLoader', function() {
  describe('Basic', function() {
    before(function() {
      global.window = new JSDOM(domStr, { resources: 'usable' }).window;
      global.document = global.window.document;

      this.opts = {
        replace: 'custom-replace',
        done: 'custom-done',
        error: 'custom-error',
        image: 'custom-image',
      };
    });

    it('Extends Group', function() {
      const imageLoader = new ImageLoader();

      expect(imageLoader).to.be.an.instanceof(Group);
    });

    it('group, 不传入能初始化为main', function() {
      const imageLoader = new ImageLoader();

      expect(imageLoader.group).to.equal('main');
    });

    it('options, 不传入能初始化指定值', function() {
      const imageLoader = new ImageLoader();

      expect(imageLoader.options).to.eql({
        replace: 'replace',
        done: 'done',
        error: 'error',
        image: 'image',
      });
    });

    it('options, 传入Object可配置，且初始化后不可修改(freeze)', function() {
      const imageLoader = new ImageLoader('main', this.opts);

      expect(imageLoader.options).to.eql(this.opts);
      expect(Object.isFrozen(imageLoader._options)).to.be.true;
    });

    it('options, 传入非Object将抛出TypeError', function() {
      const str = () => { new ImageLoader('main', ''); };
      const nul = () => { new ImageLoader('main', null); };

      expect(str).to.throw(TypeError);
      expect(nul).to.throw(TypeError);
    });

    it('options, 不能直接修改options属性', function() {
      const imageLoader = new ImageLoader('main', this.opts);

      const result = () => { imageLoader.options = 'foo'; };
      expect(result).to.throw(TypeError);
    });

    it('inview, 元素在可视区域返回true', function() {
      window.innerHeight = 100;
      const item = {
        getBoundingClientRect() {
          return {
            height: 0,
            top: 99,
          };
        },
      };

      // 元素顶部距窗口上部距离小于窗口高度、元素底部距离窗口顶部距离为正
      expect(ImageLoader.inview(item)).to.be.true;
    });

    it('inview, 元素不在可视区域返回false', function() {
      window.innerHeight = 100;
      const itemTop = {
        getBoundingClientRect() {
          return {
            height: -99,
            top: 99,
          };
        },
      };
      const itemBottom = {
        getBoundingClientRect() {
          return {
            height: 0,
            top: 100,
          };
        },
      };

      // 分两个量判断
      expect(ImageLoader.inview(itemTop)).to.be.false;
      expect(ImageLoader.inview(itemBottom)).to.be.false;
    });
  });

  describe('Methods', function() {
    before(function() {
      const fakeImg = document.createElement('image');
      fakeImg.src = webpData;

      // fake data
      this.fake = {
        image: fakeImg,
        src: 'fake.image',
      };

      // 筛选需加载的loader
      sinon.stub(ImageLoader, 'inview').callsFake(item => (
        item.dataset.group === 'loader' || item.dataset.group === 'fail'
      ));

      // 筛选加载成功和加载失败
      sinon.stub(ImageLoader, 'loadImage').callsFake((item) => (
        new Promise((resolve, reject) => {
          const { image, src } = this.fake;

          if (item.dataset.group === 'loader') {
            resolve(image);
          } else {
            reject(src);
          }
        })
      ));
    });

    beforeEach(function() {
      global.window = new JSDOM(domStr).window;
      global.document = global.window.document;

      this.imageLoader = new ImageLoader();
    });

    after(() => {
      ImageLoader.inview.restore();
      ImageLoader.loadImage.restore();
    });

    it('done, 正确添加Element，切换到done状态', function() {
      const loader = document.querySelector('.image-loader.loader');
      const state = {
        loader,
        status: PROCESS_DONE,
      };

      const fakeNode = document.createElement('div');

      this.imageLoader.done(loader, fakeNode);

      expect(loader.lastElementChild).to.eql(fakeNode);
      expect(this.imageLoader.state).to.eql(state);
    });

    it('error, 切换到error状态', function() {
      const loader = document.querySelector('.image-loader.fail');
      const state = {
        loader,
        status: PROCESS_ERROR,
      };

      this.imageLoader.error(loader);

      expect(this.imageLoader.state).to.eql(state);
    });

    it('load, 未进入视线返回false', function() {
      return this.imageLoader.load('integration').then(([data]) => {
        expect(data).to.be.false;
      });
    });

    it('load, 开始加载修改开始状态', function() {
      const loader = document.querySelector('.image-loader.loader');

      const promise = this.imageLoader.load('loader');

      // 修改done状态需要在resolve时执行，所以当前是start状态
      expect(this.imageLoader.state).to.eql({
        loader,
        status: PROCESS_START,
      });

      return promise;
    });

    it('load, 加载成功返回成功信息, 触发done', function() {
      const spy = sinon.spy(this.imageLoader, 'done');

      return this.imageLoader.load('loader').then(([data]) => {
        expect(spy.calledOnce).to.be.true;

        expect(data).to.eql({
          src: webpData,
          done: true,
        });
      });
    });

    it('load, 加载失败返回失败信息, 触发error', function() {
      // 见ImageLoader.loadImage stub
      const { src } = this.fake;
      const spy = sinon.spy(this.imageLoader, 'error');

      return this.imageLoader.load('fail').then(([data]) => {
        expect(spy.calledOnce).to.be.true;

        expect(data).to.eql({
          src,
          error: true,
        });
      });
    });
  });

  describe('Integration', function() {
    before(function() {
      // 制作数据
      const images = [...new Array(20).keys()]
        .fill(tmpImageLoader)
        .map((d, index) => (
          d.replace('fake.image', `${index + 1}.image`)
        ));

      this.state = [...new Array(20).keys()].map((d) => ({
        src: `${d + 1}.image`,
        done: true,
      }));
      this.state.splice(10, 0, false, false, {
        src: 'fake.image',
        done: true,
      });

      global.window = new JSDOM(domStr).window;
      global.document = global.window.document;

      document.body.insertAdjacentHTML('afterbegin', images.slice(0, 10).join(''));
      document.body.insertAdjacentHTML('beforeend', images.slice(10).join(''));

      sinon.stub(ImageLoader, 'inview').callsFake(item => (
        item.dataset.group === 'integration'
      ));

      sinon.stub(ImageLoader, 'loadImage').callsFake((item) => (
        new Promise((resolve) => {
          const timeout = Math.ceil(Math.random() * 20);

          setTimeout(() => {
            resolve({ src: item.dataset.src });
          }, timeout)
        })
      ));

      this.imageLoader = new ImageLoader();

      // spies, 是否正确触发
      this.spyDone = sinon.spy();
      this.imageLoader.done = this.spyDone;
    });

    after(function() {
      ImageLoader.inview.restore();
      ImageLoader.loadImage.restore();
    });

    it('多图片集合测试', function() {
      return this.imageLoader.load().then((data) => {
        // 执行lazyload: 21
        expect(this.spyDone.callCount).to.equal(21);

        // 未执行lazyload: 2
        expect(document.querySelectorAll('.replace').length).to.equal(2);

        // resolve可靠
        expect(data).to.eql(this.state);
      })
    });
  });
});
