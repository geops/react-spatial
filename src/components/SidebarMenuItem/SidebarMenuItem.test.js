import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { FaGithub } from 'react-icons/fa';
import ActionLink from '../ActionLink';
import SidebarMenuItem from './SidebarMenuItem';

configure({ adapter: new Adapter() });

describe('SidebarMenuItem', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <SidebarMenuItem title="Title" icon={<FaGithub />} onClick={() => {}} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with props "showIconOnly".', () => {
    const component = renderer.create(
      <SidebarMenuItem
        title="Title"
        icon={<FaGithub />}
        onClick={() => {}}
        showIconOnly
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with props "active".', () => {
    const component = renderer.create(
      <SidebarMenuItem
        title="Title"
        icon={<FaGithub />}
        onClick={() => {}}
        active
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with ActionLink as body.', () => {
    const component = renderer.create(
      <SidebarMenuItem title="Title" icon={<FaGithub />} onClick={() => {}}>
        <ActionLink onClick={() => {}}>Click Me!</ActionLink>
      </SidebarMenuItem>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Should trigger onClick.', () => {
    const funcs = { onClick: () => {} };
    const spy = jest.spyOn(funcs, 'onClick');

    const item = shallow(
      <SidebarMenuItem
        title="Title"
        icon={<FaGithub />}
        className="item-class"
        onClick={() => funcs.onClick()}
        showIconOnly
      />,
    );

    item
      .find('.item-class')
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
