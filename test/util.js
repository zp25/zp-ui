import chai from 'chai';
import { JSDOM } from 'jsdom';
import Util from '../src/util';
import { Subject } from 'zp-lib';

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
  describe('Properties', () => {
    let util = null;

    before(() => {
      util = new Util();
    });

    it('group, exists', () => {
      util.should.have.property('group');
    });

    it('subject, Subject类的实例', () => {
      util.subject.should.be.an.instanceof(Subject);
    });
  });

  describe('Methods', () => {
    let util = null;
    let $ = null;

    const observer = { update: () => true };
    const observers = [
      { update: () => true },
      { update: () => true },
    ];

    beforeEach(() => {
      const { document } = new JSDOM(domStr).window;
      $ = document.querySelector.bind(document);

      util = new Util();
    });

    it('Static: closest, 获取匹配的父元素', () => {
      const text = $('.text');
      const parent = $('.parent');

      Util.closest(text, '.parent').should.eql(parent);
    });

    it('Static: closest, 若不存在匹配元素返回null', () => {
      const text = $('.text');

      (Util.closest(text, '.noParent') === null).should.be.true;
    });

    it('attach, 接收observer或observer数组绑定到subject，返回已绑定observer数量', () => {
      const lenA = util.attach(observer);
      const lenB = util.attach(observers);

      observers.concat(observer).forEach((o) => {
        util.subject.observers.should.include(o);
      });

      lenA.should.equal(1);
      lenB.should.equal(3);
    });

    it('detach, 移除传入的observer，可传入observer数组，返回剩余绑定observer数量', () => {
      util.attach(observers.concat(observer));

      const lenA = util.detach(observer);
      const lenB = util.detach(observers);

      observers.concat(observer).forEach((o) => {
        util.subject.observers.should.not.include(o);
      });

      lenA.should.equal(2);
      lenB.should.equal(0);
    });
  });
});
