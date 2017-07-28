import chai from 'chai';
import { JSDOM } from 'jsdom';
import Util from '../src/util';

chai.should();

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="parent">
    <div class="content">
      <p class="text">Hello world</p>
    </div>
  </div>
</body>
</html>
`;

describe('Util', () => {
  let $ = null;
  let util = null;

  before(() => {
    const { document } = new JSDOM(domStr).window;
    $ = document.querySelector.bind(document);

    util = new Util();
  });

  it('拥有属性group', () => {
    util.should.have.property('group');
  });

  it('静态方法closest可获取匹配的父元素', () => {
    const text = $('.text');
    const parent = $('.parent');

    Util.closest(text, '.parent').should.eql(parent);
  });

  it('若不存在匹配元素，静态方法closest返回null', () => {
    const text = $('.text');

    (Util.closest(text, '.noParent') === null).should.be.true;
  });

  it('静态方法escapeHtml能够编码html特殊字符，包括[&<>"\']', () => {
    const raw = '&<>"\'';
    const escaped = '&amp;&lt;&gt;&quot;&#039;';

    Util.escapeHtml(raw).should.equal(escaped);
  });
});
