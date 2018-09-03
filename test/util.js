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
  describe('Static', () => {
    let $ = null;

    before(() => {
      const { document } = new JSDOM(domStr).window;
      $ = document.querySelector.bind(document);
    });

    it('closest, 获取匹配的父元素', () => {
      const text = $('.text');
      const parent = $('.parent');

      Util.closest(text, '.parent').should.eql(parent);
    });

    it('closest, 若不存在匹配元素返回null', () => {
      const text = $('.text');

      (Util.closest(text, '.noParent') === null).should.be.true;
    });
  });

  describe('Properties', () => {
    let util = null;

    before(() => {
      util = new Util();
    });

    it('group, 是string', () => {
      util.group.should.be.a('string');
    });

    it('subject, Subject类的实例', () => {
      util.subject.should.be.an.instanceof(Subject);
    });
  });

  describe('Methods', () => {
    let util = null;

    const observer = { update: () => true };
    const observers = [
      { update: () => true },
      { update: () => true },
    ];

    beforeEach(() => {
      util = new Util();
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

    it('setState, 传入参数非Object抛出错误', () => {
      util.setState.bind(util, null).should.throw(TypeError, 'Not an Object');
      util.setState.bind(util, false).should.throw(TypeError, 'Not an Object');
      util.setState.bind(util, 1).should.throw(TypeError, 'Not an Object');
      util.setState.bind(util, 'foo').should.throw(TypeError, 'Not an Object');
      util.setState.bind(util, Symbol('foo')).should.throw(TypeError, 'Not an Object');
    });

    it('setState, 状态切换，会过滤原state没有的属性', () => {
      const prev = {
        foo: 1,
        bar: 2,
      };
      const state = {
        foo: 2,
        baz: 3,
      };
      const result = {
        foo: 2,
        bar: 2,
      };

      util.state = prev;

      util.setState(state);
      util.state.should.eql(result);
    });
  });
});
