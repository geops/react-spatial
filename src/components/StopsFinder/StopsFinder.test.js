import React from "react";
import renderer from "react-test-renderer";
import { Map } from "ol";
import StopsFinder from ".";

describe("StopsFinder", () => {
  let map;

  beforeEach(() => {
    map = new Map({});
  });

  test("matches snapshots.", () => {
    const component = renderer.create(<StopsFinder map={map} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
