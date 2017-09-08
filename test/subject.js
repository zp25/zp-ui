import chai from 'chai';
import sinon from 'sinon';
import Subject from '../src/subject';

chai.should();

describe('Subject', () => {
  let subject = null;
  let spyNotify = null;
  let spyUpdate = null;

  const observer = { update: () => true };
  const stateA = { foo: 1, bar: 2 };
  const stateB = { baz: 3 };

  before(() => {
    subject = new Subject();

    spyNotify = sinon.spy(subject, 'notify');
    spyUpdate = sinon.spy(observer, 'update');
  });

  /**
   * Properties
   */
  it('Prop: observers, 存在且是array', () => {
    subject.observers.should.be.an('array');
  });

  it('Prop: _state, exists', () => {
    subject.should.have.property('_state');
  });

  /**
   * Methods
   */
  it('Method: attach, 绑定observer实例到subject.observers', () => {
    subject.attach(observer);

    subject.observers.should.include(observer);
  });

  it('Method: attach, 若observer已绑定，不会再次添加', () => {
    subject.attach(observer);

    subject.observers.should.have.lengthOf(1);
  });

  it('Method: state, 读取和更新状态，状态存于subject._state，并触发subject.notify', () => {
    subject.state = stateA;

    subject.state.should.eql(stateA);
    subject.state.should.eql(subject._state);

    spyNotify.calledOnce.should.be.true;
  });

  it('Method: notify, 调用所有observer的update方法，接收合并后的state和prevState', () => {
    subject.state = stateB;

    const state = Object.assign({}, stateA, stateB);
    spyUpdate.calledWithExactly(state, stateA).should.be.true;
  });

  it('Method: detach, 从subject.observers移除observer实例', () => {
    subject.detach(observer);

    subject.observers.should.not.include(observer);
  });
});
