import chai from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import Modal from '../src/modal';
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
  <div class="modal" data-group="main">
    <div class="modal__dialog modal__dialog--loading">
      ${loading()}
    </div>
    <div class="modal__dialog modal__dialog--message">
      <p class="message"></p>
    </div>
  </div>
</body>
</html>
`;

describe('Modal', () => {
  describe('Basic', () => {
    let modal = null;

    before(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      modal = new Modal('main');
    });

    it('Extends: Util', () => {
      modal.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: modal, 容器实例', () => {
      const target = document.querySelector('.modal');

      modal.modal.should.be.eql(target);
    });
  });

  describe('Methods', () => {
    let modal = null;
    // dialog
    let loading = null;
    let prompt = null;

    const modalActiveName = 'modal--active';
    const dialogActiveName = 'modal__dialog--active';

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

      modal = new Modal('main');

      loading = document.querySelector('.modal__dialog--loading');
      prompt = document.querySelector('.modal__dialog--message');
    });

    it('prompt, 显示modal并正确切换dialog，可自定义message', () => {
      const [raw, encoded] = msgList[0];
      const state = {
        'loading': false,
        'message': true,
      };

      modal.prompt('message', raw);

      const result = {
        'loading': loading.classList.contains(dialogActiveName),
        'message': prompt.classList.contains(dialogActiveName),
      };

      // modal状态
      modal.modal.classList.contains(modalActiveName).should.be.true;
      // dialog状态
      result.should.be.eql(state);
      // 自定义message
      prompt.querySelector('.message').innerHTML.should.equal(encoded);
    });

    it('prompt, 无匹配dialog将抛出Error', () => {
      const func = () => { modal.prompt('nopanel'); };

      func.should.throw(Error);
    });

    it('prompt, 能处理多种数据类型message', () => {
      msgList.forEach(([raw, encoded]) => {
        modal.prompt('message', raw);
        prompt.querySelector('.message').innerHTML.should.equal(encoded);
      });
    });

    it('loading, prompt语法糖', () => {
      const spy = sinon.spy();
      modal.prompt = spy;

      modal.loading();

      spy.calledWithExactly('loading').should.be.true;
    });

    it('open, 显示modal，不显示任何dialog', () => {
      const state = {
        'loading': false,
        'message': false,
      };

      modal.open();

      const result = {
        'loading': loading.classList.contains(dialogActiveName),
        'message': prompt.classList.contains(dialogActiveName),
      };

      // modal状态
      modal.modal.classList.contains(modalActiveName).should.be.true;
      // dialog状态
      result.should.be.eql(state);
    });

    it('close, 隐藏modal', () => {
      modal.close();

      modal.modal.classList.contains(modalActiveName).should.be.false;
    });
  });
});
