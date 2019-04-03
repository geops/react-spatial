import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TiImage } from 'react-icons/ti';
import FeatureExportButton from '.';

configure({ adapter: new Adapter() });

describe('FeatureExportButton', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <FeatureExportButton
        title="kmlExport"
        className="tm-kml-export-example"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with children passed.', () => {
    const component = renderer.create(
      <FeatureExportButton>
        <TiImage />
      </FeatureExportButton>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should be trigger click function.', () => {
    const wrapper = shallow(<FeatureExportButton />);
    const spy = jest.spyOn(FeatureExportButton.prototype, 'exportFeature');

    wrapper.find('.tm-feature-export').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
