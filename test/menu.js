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
    <a href="#a" class="menu__anchor" data-page="你好">你好</a>
    <a href="#a" class="menu__anchor" data-page="hello">hello</a>
    <a href="#a" class="menu__anchor" data-page="hola">hola</a>
  </menu>
</body>
</html>
`;

describe('Menu', () => {
  describe('Basic', () => {
    let menu = null;

    before(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      menu = new Menu('main');
    });

    it('Extends: Util', () => {
      menu.should.be.an.instanceof(Util);
    });

    /**
     * Properties
     */
    it('Prop: menu, 容器实例', () => {
      const target = document.querySelector('.menu');

      menu.menu.should.be.eql(target);
    });
  });

  describe('Methods', () => {
    let menu = null;
    const activeName = 'menu__anchor--active';

    beforeEach(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      menu = new Menu('main');
    });

    it(`open, 传入参数可正确聚焦anchor(添加${activeName}类)`, () => {
      const state = {
        '你好': false,
        'hello': false,
        'hola': true,
      };

      menu.open('hola', true);

      const result = menu.anchors.reduce((prev, anchor) => (
        Object.assign({}, prev, {
          [anchor.dataset.page]: anchor.classList.contains(activeName),
        })
      ), {});

      result.should.be.eql(state);
    });

    it('open, 无匹配anchor但设置fallback，将聚焦容器中第一项', () => {
      const state = {
        '你好': true,
        'hello': false,
        'hola': false,
      };

      menu.open('empty', true);

      const result = menu.anchors.reduce((prev, anchor) => (
        Object.assign({}, prev, {
          [anchor.getAttribute('data-page')]: anchor.classList.contains(activeName),
        })
      ), {});

      result.should.be.eql(state);
    });

    it('open, 无匹配anchor且不使用fallback将抛出Error', () => {
      const fn = () => { menu.open('empty'); };

      fn.should.throw(Error);
    });

    it('page, 获取当前打开的page，未打开任何page返回空', () => {
      menu.page.should.be.empty;

      menu.open('hello');

      menu.page.should.be.equal('hello');
    });
  });
});
