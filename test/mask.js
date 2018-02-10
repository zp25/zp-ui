import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import Mask from '../src/mask';
import Util from '../src/util';

chai.should();

const loading = () => {
  const arr = [...new Array(12).keys()].map(d => d + 1);

  const circles = arr.reduce((prev, d) => (
    `${prev}<span class="loading__circle loading__circle--${d}"></span>`
  ), '');

  return `<div class="loading">${circles}</div>`;
};

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="mask" data-group="main">
    <div class="mask__panel mask__panel--loading panel panel--black-reverse">
      <div class="panel__body">
        ${loading()}
      </div>
    </div>
    <div class="mask__panel mask__panel--message panel panel--black-reverse">
      <div class="panel__body">
        <p class="message"></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

describe('Mask', () => {
  describe('Basic', () => {
    let mask = null;

    before(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      mask = new Mask('main');
    });

    it('Extends: Util', () => {
      mask.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: mask, 容器实例', () => {
      const target = document.querySelector('.mask');

      mask.mask.should.be.eql(target);
    });
  });

  describe('Methods', () => {
    let mask = null;
    // panels
    let loading = null;
    let prompt = null;

    const maskActiveName = 'mask--active';
    const panelActiveName = 'mask__panel--active';

    const msgList = [
      ['custome message', 'custome message'],
      [NaN, 'NaN'],
      [0, '0'],
      [false, 'false'],
      [undefined, ''],
      [null, 'null'],
      [[], ''],
      [{}, '[object Object]'],
    ];

    before(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      mask = new Mask('main');

      loading = document.querySelector('.mask__panel--loading');
      prompt = document.querySelector('.mask__panel--message');
    });

    it('prompt, 显示mask并正确切换panel，可自定义message', () => {
      const [raw, encoded] = msgList[0];
      const state = {
        'loading': false,
        'message': true,
      };

      mask.prompt('message', raw);

      const result = {
        'loading': loading.classList.contains(panelActiveName),
        'message': prompt.classList.contains(panelActiveName),
      };

      // mask状态
      mask.mask.classList.contains(maskActiveName).should.be.true;
      // panel状态
      result.should.be.eql(state);
      // 自定义message
      prompt.querySelector('.message').innerHTML.should.equal(encoded);
    });

    it('prompt, 无匹配panel将抛出Error', () => {
      const func = () => { mask.prompt('nopanel'); };

      func.should.throw(Error);
    });

    it('prompt, 能处理多种数据类型message', () => {
      msgList.forEach(([raw, encoded]) => {
        mask.prompt('message', raw);
        prompt.querySelector('.message').innerHTML.should.equal(encoded);
      });
    });

    it('loading, prompt语法糖', () => {
      const spy = sinon.spy();
      mask.prompt = spy;

      mask.loading();

      spy.calledWithExactly('loading').should.be.true;
    });

    it('show, 显示mask，不显示任何panel', () => {
      const state = {
        'loading': false,
        'message': false,
      };

      mask.show();

      const result = {
        'loading': loading.classList.contains(panelActiveName),
        'message': prompt.classList.contains(panelActiveName),
      };

      // mask状态
      mask.mask.classList.contains(maskActiveName).should.be.true;
      // panel状态
      result.should.be.eql(state);
    });

    it('hide, 隐藏mask', () => {
      mask.hide();

      mask.mask.classList.contains(maskActiveName).should.be.false;
    });
  });
});
