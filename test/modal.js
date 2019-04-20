import chai from 'chai';
import sinon from 'sinon';
import Modal from '../src/modal';
import Group from '../src/group';

const { expect } = chai;

describe('Modal', () => {
  describe('Basic', () => {
    it('Extends Group', () => {
      const modal = new Modal();

      expect(modal).to.be.an.instanceof(Group);
    });

    it('group, 不传入能初始化为main', () => {
      const modal = new Modal();

      expect(modal.group).to.equal('main');
    });

    it('state, 初始化指定值', () => {
      const modal = new Modal();

      expect(modal.state).to.eql({
        modal: false,
        dialog: '',
      });
    });

    it('currentState, 可准确转换状态', () => {
      expect(Modal.currentState(true)).to.equal('visible');
      expect(Modal.currentState(false)).to.equal('hidden');
    });

    it('currentState, 接收非boolean参数抛出TypeError', () => {
      const str = () => { Modal.currentState(''); };
      const num = () => { Modal.currentState(1); };
      const obj = () => { Modal.currentState({}); };

      expect(str).to.throw(TypeError);
      expect(num).to.throw(TypeError);
      expect(obj).to.throw(TypeError);
    });
  });

  describe('Methods', function() {
    beforeEach(function() {
      this.modal = new Modal('main');
    });

    it('prompt, 从关闭状态进入modal开启状态', function() {
      const dialog = 'dialog';

      this.modal.prompt(dialog);

      expect(this.modal.state).to.eql({
        modal: true,
        dialog,
      });
    });

    it('prompt, 从任意开启状态进入开启状态, 切换dialog', function() {
      const prev = 'prev';
      const next = 'next';

      this.modal.prompt(prev);
      this.modal.prompt(next);

      expect(this.modal.state).to.eql({
        modal: true,
        dialog: next,
      });
    });

    it('loading, 开启modal, dialog切换到loading', function() {
      this.modal.loading();

      expect(this.modal.state).to.eql({
        modal: true,
        dialog: 'loading',
      });
    });

    it('open, 仅开启modal, 没有dialog显示', function() {
      this.modal.open();

      expect(this.modal.state).to.eql({
        modal: true,
        dialog: '',
      });
    });

    it('close, 从开启状态能进入关闭状态', function() {
      this.modal.prompt('dialog');
      this.modal.close();

      expect(this.modal.state).to.eql({
        modal: false,
        dialog: '',
      });
    });

    it('close, 关闭状态会维持，不会尝试修改state', function() {
      const result = this.modal.close();

      expect(result).to.be.false;
    });
  });
});
