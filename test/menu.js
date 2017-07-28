import chai from 'chai';
import { JSDOM } from 'jsdom';
import Menu from '../src/menu';

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

  it('切换menu__anchor的menu__anchor--active类', () => {
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
});
