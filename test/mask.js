import chai from 'chai';
import { JSDOM } from 'jsdom';
import Mask from '../src/mask';
import Util from '../src/util';

chai.should();

const circles = () => {
  let arr = [...new Array(12).keys()];
  arr = arr.map((d, index) => ({
    id: index + 1,
  }));

  return arr.reduce((prev, d) => (
    `${prev}<span class="loading__circle loading__circle--${d.id + 1}"></span>`
  ), '');
};

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="mask" data-group="main">
    <div class="mask__panel mask__panel--loading panel panel--black-reverse">
      <div class="panel__body">
        <div class="loading">${circles()}</div>
        <p class="message"></p>
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
  let mask = null;

  let loading = null;
  let prompt = null;

  const maskActiveName = 'mask--active';
  const panelActiveName = 'mask__panel--active';

  const msgList = [
    'custome message',
    666,
    false,
    undefined,
    null,
    {},
  ];
  const innerHTMLList = [
    'custome message',
    '666',
    'false',
    '',
    'null',
    '[object Object]',
  ];

  before(() => {
    const window = new JSDOM(domStr).window;
    global.document = window.document;

    mask = new Mask('main');

    loading = document.querySelector('.mask__panel--loading');
    prompt = document.querySelector('.mask__panel--message');
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

  /**
   * Methods
   */
  it('Method: loading, 显示mask并正确切换mask__panel，第一个参数自定义message', () => {
    const msg = msgList[0];
    const state = {
      'loading': true,
      'message': false,
    };

    mask.loading(msg);

    const result = {
      'loading': loading.classList.contains(panelActiveName),
      'message': prompt.classList.contains(panelActiveName),
    };

    // mask状态
    mask.mask.classList.contains(maskActiveName).should.be.true;
    // panel状态
    result.should.be.eql(state);
    // 自定义message
    loading.querySelector('.message').innerHTML.should.equal(msg);
  });

  it('Method: loading, 不传入参数message使用空字符串', () => {
    mask.loading();
    loading.querySelector('.message').innerHTML.should.equal('');
  });

  it('Method: prompt, 显示mask，第一个参数选择显示的mask__penel，第二个参数自定义message', () => {
    const msg = msgList[0];
    const state = {
      'loading': false,
      'message': true,
    };

    mask.prompt('message', msg);

    const result = {
      'loading': loading.classList.contains(panelActiveName),
      'message': prompt.classList.contains(panelActiveName),
    };

    // mask状态
    mask.mask.classList.contains(maskActiveName).should.be.true;
    // panel状态
    result.should.be.eql(state);
    // 自定义message
    prompt.querySelector('.message').innerHTML.should.equal(msg);
  });

  it('Method: prompt, 无匹配panel将抛出Error', () => {
    const msg = msgList[0];
    const func = () => { mask.prompt('nopanel', msg); };

    func.should.throw(Error);
  });

  it('Method: prompt, 能处理多种数据类型message', () => {
    msgList.forEach((msg, index) => {
      mask.prompt('message', msg);
      prompt.querySelector('.message').innerHTML.should.equal(innerHTMLList[index]);
    });
  });

  it('Method: show, 显示mask，不显示任何panel', () => {
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

  it('Method: hide, 隐藏mask', () => {
    mask.hide();

    mask.mask.classList.contains(maskActiveName).should.be.false;
  });
});
