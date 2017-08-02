import chai from 'chai';
import { JSDOM } from 'jsdom';
import Menu from '../src/menu';
import Util from '../src/util';

chai.should();

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <menu class="menu" data-group="main">
    <a href="#a" class="menu__anchor" data-page="你好"></p>
    <a href="#a" class="menu__anchor" data-page="hello"></p>
    <a href="#a" class="menu__anchor" data-page="hola"></p>
  </menu>
</body>
</html>
`;

describe('Menu', () => {
  let menu = null;

  before(() => {
    const window = new JSDOM(domStr).window;
    global.document = window.document;

    menu = new Menu('main');
  });

  it('Extends: Util', () => {
    menu.should.be.an.instanceof(Util);
  });

  it('Prop: menu, 容器实例', () => {
    const target = document.querySelector('.menu');

    menu.menu.should.be.eql(target);
  });

  it('Method: open, 传入参数可正确聚焦menu__anchor(添加menu__anchor--active类)', () => {
    const state = {
      '你好': false,
      'hello': false,
      'hola': true,
    };

    const page = 'hola';
    menu.open(page);

    const result = Array.from(menu.anchor).reduce((prev, item) => (
      Object.assign({}, prev, {
        [item.getAttribute('data-page')]: item.classList.contains('menu__anchor--active'),
      })
    ), {});

    result.should.be.eql(state);
  });

  it('Method: open, 未传入参数或无匹配menu__anchor将聚焦容器中第一个menu__anchor', () => {
    const state = {
      '你好': true,
      'hello': false,
      'hola': false,
    };

    const page = 'empty';
    menu.open(page);

    const result = Array.from(menu.anchor).reduce((prev, item) => (
      Object.assign({}, prev, {
        [item.getAttribute('data-page')]: item.classList.contains('menu__anchor--active'),
      })
    ), {});

    result.should.be.eql(state);
  });
});
