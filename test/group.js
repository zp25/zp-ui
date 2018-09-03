import chai from 'chai';
import { JSDOM } from 'jsdom';
import Group from '../src/group';

chai.should();

const domStr = `
<!DOCTYPE html>
<html>
<body>
  <div class="group" data-group="group"></div>
  <div class="group" data-group="group"></div>
  <div class="group" data-group="group"></div>
</body>
</html>
`;

describe('Group', () => {
  describe('Basic', () => {
    it('未传入group将抛出错误', () => {
      const wrapper = () => {
        new Group();
      };

      wrapper.should.throw(Error, 'Please choose a group');
    });
  });

  describe('Methods', () => {
    let group = null;

    beforeEach(() => {
      const window = new JSDOM(domStr).window;
      global.document = window.document;

      group = new Group('group');
    });

    it('members, 所有当前组元素组成的NodeList', () => {
      const nodes = document.querySelectorAll('.group');

      group.members().should.eql(nodes);
    });

    it('update, 更新状态', () => {
      const state = { foo: 6, bar: 12 };

      group.update(state);
      group.subject.state.should.eql(state);
    });

    it('getState, 获取当前状态', () => {
      const state = { foo: 6, bar: 12 };

      group.subject.state = state;
      group.getState().should.eql(state);
    });
  });
});
