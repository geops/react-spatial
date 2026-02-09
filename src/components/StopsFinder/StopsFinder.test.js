import { render } from "@testing-library/react";
import { Map } from "ol";
import React from "react";

import StopsFinder from ".";

describe("StopsFinder", () => {
  let map;

  beforeEach(() => {
    map = new Map({});
  });

  test("matches snapshots.", () => {
    const { container } = render(<StopsFinder map={map} />);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
