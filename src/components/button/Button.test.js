import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Button from './Button';

configure({ adapter: new Adapter() });

const funcs = {
  onClick: () => {},
};

test('Menu should match snapshot.', () => {
  const component = renderer.create(
    <Button
      className="tm-zoom in"
      title="Zoom in"
      ariaLabel="aria-label"
      onClick={() => funcs.onClick()}
    >
      +
    </Button>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Button should update.', () => {
  const spy = jest.spyOn(funcs, 'onClick');
  const bt = shallow(
    <Button
      className="tm-class"
      title="Zoom"
      ariaLabel="aria-label"
      onClick={() => funcs.onClick()}
    >
      +
    </Button>,
  );

  bt.find('.tm-class').first().simulate('click');
  bt.find('.tm-class').first().simulate('keypress', { which: 13 });
  expect(spy).toHaveBeenCalledTimes(2);
});
