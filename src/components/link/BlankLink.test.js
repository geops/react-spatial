import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import BlankLink from './BlankLink';

configure({ adapter: new Adapter() });

describe('BlankLink', () => {
  describe('when no properties are set', () => {
    let spy = null;

    beforeEach(() => {
      window.console.error = jest.fn().mockImplementation(() => {});
      spy = jest.spyOn(window.console, 'error');
    });

    afterEach(() => {
      spy.mockRestore();
      window.console.error.mockRestore();
    });

    test('displays 2 errors in the console', () => {
      shallow(<BlankLink />);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<BlankLink />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const href = 'http://google.com';
    const label = 'foo';
    const title = 'bar';
    const className = 'qux';

    test('matches snapshot', () => {
      const component = renderer.create(
        <BlankLink href={href} title={title} className={className}>
          {label}
        </BlankLink>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
