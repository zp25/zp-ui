import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import ImageLoader from '../src/imageLoader';
import Util from '../src/util';
import {
  PROCESS_START,
  PROCESS_DONE,
  PROCESS_ERROR,
} from '../constants';

chai.should();

const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
const tmpImageLoader = `
  <div
    class="image-loader replace"
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
      class="image-loader replace"
      data-src="${webpData}"
      data-group="loader"
    >
      <img src="fake_preview.jpg" alt="fake image" class="image image--thumbnail">
    </div>

    <div
      class="image-loader replace"
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

describe('ImageLoader', () => {
  describe('Basic', () => {
    let imageLoader = null;

    before(() => {
      global.window = new JSDOM(domStr).window;
      global.document = global.window.document;

      imageLoader = new ImageLoader();
    });

    it('Extends Util', () => {
      imageLoader.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: loaders, HTMLCollection', () => {
      imageLoader.loaders.should.be.an.instanceof(window.HTMLCollection);
    });
  });

  describe('Methods', () => {
    let loader = null;
    let fail = null;
    let imageLoader = null;
    // fake data
    let fake = {
      image: null,
      src: '',
    };

    before(() => {
      const fakeImg = document.createElement('image');
      fakeImg.src = webpData;

      fake = Object.assign({}, fake, {
        image: fakeImg,
        src: 'fake.image',
      });

      // 筛选需加载的loader
      sinon.stub(ImageLoader, 'inview').callsFake(item => (
        item.dataset.group === 'loader' || item.dataset.group === 'fail'
      ));

      // 筛选加载成功和加载失败
      sinon.stub(ImageLoader, 'loadImage').callsFake((item) => (
        new Promise((resolve, reject) => {
          if (item.dataset.group === 'loader') {
            resolve(fake.image);
          } else {
            reject(fake.src);
          }
        })
      ));
    });

    beforeEach(() => {
      global.window = new JSDOM(domStr).window;
      global.document = global.window.document;

      // 加载成功
      loader = document.querySelector('.image-loader[data-group="loader"]');
      // 加载失败
      fail = document.querySelector('.image-loader[data-group="fail"]');

      imageLoader = new ImageLoader();
    });

    after(() => {
      ImageLoader.inview.restore();
      ImageLoader.loadImage.restore();
    });

    it('done, 正确添加Element，切换到done状态，添加done类', () => {
      const state = {
        loader,
        status: PROCESS_DONE,
      };

      const fakeNode = document.createElement('div');

      imageLoader.done(loader, fakeNode);

      loader.lastElementChild.should.be.eql(fakeNode);
      imageLoader.subject.state.should.be.eql(state);
      loader.classList.contains('done').should.be.true;
    });

    it('error, 切换到error状态，添加error类', () => {
      const state = {
        loader,
        status: PROCESS_ERROR,
      };

      imageLoader.error(loader);

      imageLoader.subject.state.should.be.eql(state);
      loader.classList.contains('error').should.be.true;
    });

    it('main, 延时加载启动后，立即从loaders列表中移出loader', (done) => {
      const pre = new WeakSet(imageLoader.loaders);
      pre.has(loader).should.be.true;

      imageLoader.lazyload().then(() => {
        done();
      });

      const post = new WeakSet(imageLoader.loaders);
      post.has(loader).should.be.false;
    });

    it('main, 能正确处理图片加载成功和失败', () => {
      const {
        image: fakeImg,
        src: fakeSrc,
      } = fake;
      const state = [
        {
          src: webpData,
          done: true,
        },
        {
          src: fakeSrc,
          error: true,
        },
        false,
      ];

      // spies, 是否正确触发
      const spyDone = sinon.spy();
      const spyError = sinon.spy();

      imageLoader.done = spyDone;
      imageLoader.error = spyError;

      return imageLoader.lazyload().then((data) => {
        spyDone.calledOnce.should.be.true;
        spyDone.getCall(0).args.should.be.eql([loader, fakeImg]);

        spyError.calledOnce.should.be.true;
        spyError.getCall(0).args[0].should.be.eql(fail);

        // 设置withArgs(loader)也通过检测，设置string类型不通过，比较方式是什么？
        // spyError.withArgs(fail).calledOnce.should.be.true;

        data.should.be.eql(state);
      });
    });
  });

  describe('Integration', () => {
    let imageLoader = null;
    let spyDone = null;

    const images = [...new Array(20).keys()].fill(tmpImageLoader).map((d, index) => (
      d.replace('fake.image', `${index + 1}.image`)
    ));

    let state = [...new Array(20).keys()].map((d) => ({
      src: `${d + 1}.image`,
      done: true,
    }));
    state = state.slice(0, 10).concat(false, false, {
      src: 'fake.image',
      done: true,
    }, state.slice(10));

    before(() => {
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

      imageLoader = new ImageLoader();

      // spies, 是否正确触发
      spyDone = sinon.spy();
      imageLoader.done = spyDone;
    });

    after(() => {
      ImageLoader.inview.restore();
      ImageLoader.loadImage.restore();
    });

    it('多图片集合测试', () => (
      imageLoader.lazyload().then((data) => {
        // 执行lazyload: 21, 未执行: 2
        spyDone.callCount.should.be.equal(21);
        // resolve可靠
        data.should.be.eql(state);
      })
    ));
  });
});
