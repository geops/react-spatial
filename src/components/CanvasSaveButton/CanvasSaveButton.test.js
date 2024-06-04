/* eslint-disable react/button-has-type */
import "jest-canvas-mock";
import React from "react";
import Map from "ol/Map";
import View from "ol/View";
import { TiImage } from "react-icons/ti";
import RenderEvent from "ol/render/Event";
import { fireEvent, render } from "@testing-library/react";
import CanvasSaveButton from "./CanvasSaveButton";

describe("CanvasSaveButton", () => {
  let olMap;
  const conf = {
    title: "Karte als Bild speichern.",
    icon: <TiImage focusable={false} />,
    className: "ta-example",
    saveFormat: "image/jpeg",
  };

  beforeEach(() => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    target.style.width = "100px";
    target.style.height = "100px";
    olMap = new Map({
      target,
      controls: [],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    olMap.getView().setCenter([1000, 1000]);
  });

  afterEach(() => {
    if (olMap.getTargetElement()) {
      document.body.removeChild(olMap.getTargetElement());
    }
    olMap.setTarget(null);
  });

  test("should match snapshot.", () => {
    const component = render(
      <CanvasSaveButton format={conf.saveFormat} map={olMap}>
        <button>{conf.icon}</button>
      </CanvasSaveButton>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with a different attributes", () => {
    const component = render(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <CanvasSaveButton title={conf.title} className="foo" tabIndex="1">
        <button>{conf.icon}</button>
      </CanvasSaveButton>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  test("should call onSaveBefore then download then onSaveEnd function on click.", async () => {
    const saveStart = jest.fn((m) => {
      return Promise.resolve(m);
    });
    const saveEnd = jest.fn();
    const wrapper = render(
      <CanvasSaveButton
        map={olMap}
        format={conf.saveFormat}
        onSaveStart={saveStart}
        onSaveEnd={saveEnd}
        extraData={{
          copyright: {
            text: () => {
              return (
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)" +
                "contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)"
              );
            },
          },
        }}
      >
        <button className="ta-example">{conf.icon}</button>
      </CanvasSaveButton>,
    );
    const link = document.createElement("a");
    link.click = jest.fn();
    const div = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.toBlob = jest.fn((callback) => {
      return callback();
    });
    global.URL.createObjectURL = jest.fn(() => {
      return "fooblob";
    });
    // We use a spy here to be able to correctly restore the initial function
    const spy3 = jest
      .spyOn(global.document, "createElement")
      .mockImplementation((elt) => {
        if (elt === "canvas") {
          return canvas;
        }
        if (elt === "div") {
          return div;
        }
        if (elt === "a") {
          return link;
        }
        return {};
      });
    jest
      .spyOn(olMap.getTargetElement(), "getElementsByTagName")
      .mockReturnValue([canvas]);

    await fireEvent.click(wrapper.container.querySelector(".ta-example"));
    await olMap.dispatchEvent(
      new RenderEvent("rendercomplete", undefined, undefined, {
        canvas,
      }),
    );
    await window.setTimeout(() => {
      expect(saveStart).toHaveBeenCalledTimes(1);
      expect(saveEnd).toHaveBeenCalledTimes(1);
      expect(link.href).toBe("http://localhost/fooblob");
      expect(link.download).toBe(".jpg");
      expect(link.click).toHaveBeenCalledTimes(1);
      spy3.mockRestore();
    });
  });
});
