import 'jest-canvas-mock';
import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { Feature } from 'ol';
import { Fill, Stroke, Style, Icon, Text } from 'ol/style';
import FeatureStyler from '.';

configure({ adapter: new Adapter() });

const dashedLine = new Style({
  stroke: new Stroke({
    color: 'red',
    lineDash: [10, 10],
    width: 3,
  }),
});

// Text style with a custom style
const simpleText = new Style({
  text: new Text({
    text: 'foo',
  }),
});

// Icon style with a custom style
const simpleIcon = new Style({
  image: new Icon({
    src: 'images/favicon.png',
    scale: 3,
  }),
});

describe('FeatureStyler', () => {
  describe('matches snapshot', () => {
    test('when no feature provided', () => {
      const component = renderer.create(<FeatureStyler />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('when feature has no styleFunction() defined', () => {
      const component = renderer.create(
        <FeatureStyler feature={new Feature()} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    describe('when feature has a styleFunction() which', () => {
      const featReturnsStyle = new Feature();
      featReturnsStyle.setStyle(() => {
        return simpleIcon;
      });

      const featReturnsArray = new Feature();
      // The call to getStyleFunction()() will return an array: [simpleIcon];
      featReturnsArray.setStyle(simpleIcon);

      const featReturns3Styles = new Feature();
      featReturns3Styles.setStyle([simpleIcon, simpleText, dashedLine]);

      const featReturnsEmptyArray = new Feature();
      featReturnsEmptyArray.setStyle(() => {
        return [];
      });

      [
        {
          descr: ' a style object',
          feature: featReturnsStyle,
        },
        {
          descr: ' an array of one style',
          feature: featReturnsArray,
        },
        {
          descr: ' an empty array',
          feature: featReturnsEmptyArray,
        },
        {
          descr: ' an array of 3 styles targeting the one at index 1',
          feature: featReturns3Styles,
          idx: 1,
        },
      ].forEach(s => {
        test(`returns ${s.descr}.`, () => {
          const component = renderer.create(
            <FeatureStyler feature={s.feature} styleIdx={s.idx} />,
          );
          const tree = component.toJSON();
          expect(tree).toMatchSnapshot();
        });
      });

      test(`returns a style with icon and text values selected from properties.`, () => {
        const completeStyleModififiable = new Style({
          image: new Icon({
            src: 'images/marker.png',
            scale: 0.5,
          }),
          text: new Text({
            font: '16px arial',
            text: 'bar',
            fill: new Fill({
              color: [255, 0, 0],
            }),
            stroke: new Stroke({
              color: [255, 255, 255],
              width: 3,
            }),
            scale: 1.5,
            rotation: 0.5,
          }),
          fill: new Fill({
            color: [255, 0, 0],
          }),
          stroke: new Stroke({
            color: [255, 255, 255],
            width: 3,
          }),
        });
        const feature = new Feature();
        feature.setStyle(completeStyleModififiable);
        const component = renderer.create(<FeatureStyler feature={feature} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });

      test(`returns a style with color values selected from properties.`, () => {
        const completeStyleModififiable = new Style({
          fill: new Fill({
            color: [255, 0, 0],
          }),
          stroke: new Stroke({
            color: [255, 255, 255],
            width: 3,
          }),
        });
        const feature = new Feature();
        feature.setStyle(completeStyleModififiable);
        const component = renderer.create(<FeatureStyler feature={feature} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });

  describe('#componentDidUpdate()', () => {
    const feature = new Feature();
    feature.setStyle(simpleIcon);

    test('updates content when feature changes', () => {
      const feature2 = new Feature();
      feature2.setStyle(simpleIcon);
      const wrapper = shallow(<FeatureStyler feature={feature} />);
      const inst = wrapper.instance();
      const spy = jest.spyOn(inst, 'updateContent');
      wrapper.setProps({
        feature: feature2,
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
    });

    test("doesn't update content when new feature has no styleFunction", () => {
      const feature2 = new Feature();
      const wrapper = shallow(<FeatureStyler feature={feature} />);
      const inst = wrapper.instance();
      const spy = jest.spyOn(inst, 'updateContent');
      wrapper.setProps({
        feature: feature2,
      });
      expect(spy).toHaveBeenCalledTimes(0);
    });

    [
      'font',
      'name',
      'description',
      'color',
      {
        name: 'icon',
        value: { id: 'a', url: 'a' },
        value2: { id: 'a', url: 'a' },
      },
      {
        name: 'iconSize',
        value: { label: 'a', value: [0, 0], scale: 1 },
        value2: { label: 'a', value: [0, 0], scale: 1 },
      },
      'textColor',
      'textSize',
      'textRotation',
    ].forEach(p => {
      const name = typeof p === 'string' ? p : p.name;
      const value = typeof p === 'string' ? p : p.value;
      const value2 = typeof p === 'string' ? `${p}2` : p.value2;
      test(`apply the new style when state's property ${name} changes`, () => {
        const feature2 = new Feature();
        feature2.setStyle(simpleIcon);
        const wrapper = shallow(<FeatureStyler feature={feature} />);
        const inst = wrapper.instance();
        const spy = jest.spyOn(inst, 'applyStyle');
        const state = {};
        state[name] = value;
        inst.setState(state);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith();

        state[name] = value2;
        inst.setState(state);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith();
      });
    });
  });

  describe('when a fill style is modified', () => {
    test("set state's color property onClick of a color", () => {
      const feature = new Feature();
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: [255, 0, 0],
          }),
          stroke: new Stroke({
            color: [255, 255, 255],
            width: 3,
          }),
        }),
      );
      const wrapper = mount(<FeatureStyler feature={feature} />);
      expect(wrapper.state().color).not.toEqual(
        FeatureStyler.defaultProps.colors[1],
      );
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
      expect(wrapper.state().color).toEqual(
        FeatureStyler.defaultProps.colors[1],
      );
    });
  });

  describe('when a text style is modified', () => {
    let wrapper;
    const feature = new Feature();
    feature.setStyle(simpleText);

    beforeEach(() => {
      wrapper = mount(<FeatureStyler feature={feature} />);
    });

    test("set state's text property on input change", () => {
      expect(wrapper.state().name).toEqual('foo');
      wrapper.find('textarea').simulate('change', { target: { value: 'bar' } });
      expect(wrapper.state().name).toEqual('bar');
    });

    test("set state's text color property onClick of a color", () => {
      expect(wrapper.state().textColor).not.toEqual(
        FeatureStyler.defaultProps.colors[1],
      );
      wrapper
        .find('.tm-modify-text-color')
        .find('Button')
        .at(1)
        .simulate('click');
      expect(wrapper.state().textColor).toEqual(
        FeatureStyler.defaultProps.colors[1],
      );
    });

    test("set state's text size property on select", () => {
      expect(wrapper.state().textSize).not.toEqual(
        FeatureStyler.defaultProps.textSizes[1],
      );
      wrapper.find('Select').simulate('change', { target: { value: 2 } });
      expect(wrapper.state().textSize).toEqual(
        FeatureStyler.defaultProps.textSizes[2],
      );
    });

    test("set state's text rotation property on change input number", () => {
      expect(wrapper.state().textRotation).not.toEqual(3.141592653589793);
      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 180 } });
      expect(wrapper.state().textRotation).toEqual(3.141592653589793);
    });

    test("set state's text rotation property on change input range", () => {
      expect(wrapper.state().textRotation).not.toEqual(0.40142572795869574);
      wrapper
        .find('input')
        .at(1)
        .simulate('change', { target: { value: 23 } });
      expect(wrapper.state().textRotation).toEqual(0.40142572795869574);
    });
  });

  describe('when a icon style is modified', () => {
    let wrapper;
    const feature = new Feature();
    feature.setStyle(simpleIcon);

    beforeEach(() => {
      wrapper = mount(<FeatureStyler feature={feature} />);
    });

    test("set state's icon property onClick of a color", () => {
      const targetIcon = FeatureStyler.defaultProps.iconCategories[1].icons[0];
      expect(wrapper.state().icon).not.toEqual(targetIcon);
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
      expect(wrapper.state().icon).toEqual(targetIcon);
    });

    test("set state's icon size property on select", () => {
      const targetSize = FeatureStyler.defaultProps.iconSizes[1];
      expect(wrapper.state().iconSize).not.toEqual(targetSize);
      wrapper.find('Select').simulate('change', {
        target: {
          value: targetSize.value.toString(),
        },
      });
      expect(wrapper.state().iconSize).toEqual(targetSize);
    });
  });
});
