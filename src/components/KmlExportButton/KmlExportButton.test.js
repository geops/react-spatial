import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TiImage } from 'react-icons/ti';
import KmlExportButton from '.';

configure({ adapter: new Adapter() });

describe('KmlExportButton', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <KmlExportButton title="kmlExport" className="tm-kml-export-example" />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with children passed.', () => {
    const component = renderer.create(
      <KmlExportButton>
        <TiImage />
      </KmlExportButton>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should be trigger click function.', () => {
    const wrapper = shallow(<KmlExportButton />);
    const spy = jest.spyOn(KmlExportButton.prototype, 'exportAsKml');

    wrapper.find('.tm-kml-export').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
