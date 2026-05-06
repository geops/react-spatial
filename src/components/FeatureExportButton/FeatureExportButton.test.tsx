// @ts-nocheck
import { fireEvent, render } from "@testing-library/react";
import Feature from "ol/Feature";
import GPX from "ol/format/GPX";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import React from "react";

import "jest-canvas-mock";

import FeatureExportButton from ".";

const layer = new VectorLayer({
  name: "Sample layer",
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Point([819103.972418, 6120013.078324]),
      }),
    ],
  }),
});

describe("FeatureExportButton", () => {
  describe("should match snapshot", () => {
    test("with default attributes.", () => {
      const { container } = render(<FeatureExportButton layer={layer} />);
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot with cutom attributes.", () => {
      const { container } = render(
        <FeatureExportButton
          className="foo"
          layer={layer}
          // eslint-disable-next-line jsx-a11y/tabindex-no-positive
          tabIndex={2}
          title="bar"
        />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot with children passed.", () => {
      const { container } = render(
        <FeatureExportButton layer={layer}>
          <div>Foo</div>
        </FeatureExportButton>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("triggers onClick", () => {
    // Use library 'jest-environment-jsdom-fourteen'
    // to allow jest test of format.writeFeatures(feats).
    const renderLayer = (featNumbers) => {
      const featsArray = [];
      for (let i = 0; i < featNumbers; i += 1) {
        featsArray.push(
          new Feature({
            geometry: new Point([819103.972418, 6120013.078324]),
          }),
        );
      }

      return new VectorLayer({
        name: "ExportLayer",
        source: new VectorSource({
          features: featsArray,
        }),
      });
    };

    const iconLayer = renderLayer(1);

    const textStyle = new Style({
      text: new Text({
        font: "normal 16px Helvetica",
        stroke: new Stroke({
          color: [255, 255, 255, 1],
          width: 3,
        }),
        text: "text name",
      }),
    });

    test("should be trigger click function.", () => {
      const { container } = render(<FeatureExportButton layer={iconLayer} />);
      const spy = jest.spyOn(FeatureExportButton, "exportFeatures");
      fireEvent.click(container.querySelector(".rs-feature-export-button"));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should use attributes for parsing", () => {
      const { container } = render(
        <FeatureExportButton
          format={GPX}
          layer={iconLayer}
          projection="EPSG:4326"
        />,
      );
      const spy = jest.spyOn(FeatureExportButton, "exportFeatures");
      fireEvent.click(container.querySelector(".rs-feature-export-button"));
      expect(spy).toHaveBeenCalledWith(iconLayer, "EPSG:4326", GPX);
    });
  });
});
