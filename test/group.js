import chai from 'chai';
import Group from '../src/group';
import { Subject } from 'zp-lib';

chai.should();

describe('Group', () => {
  it('Extends: Subject', () => {
    const target = new Group('group');

    target.should.be.an.instanceof(Subject);
  });

  it('未传入group将抛出错误', () => {
    const wrapper = () => {
      new Group();
    };

    wrapper.should.throw(Error, 'Please choose a group');
  });

  it('实例属性group可查看分组', () => {
    const group = 'foo';
    const target = new Group(group);

    target.group.should.equal(group);
  });
});
