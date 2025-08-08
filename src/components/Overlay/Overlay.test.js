import { render } from "@testing-library/react";
import PropTypes from "prop-types";
import React, { act, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

import Overlay from "./Overlay";

jest.mock("resize-observer-polyfill");

const propTypes = {
  isMobileResizable: PropTypes.bool,
  thresholdWidthForMobile: PropTypes.number,
};

const defaultProps = {
  isMobileResizable: undefined,
  thresholdWidthForMobile: undefined,
};

function BasicComponent({ isMobileResizable, thresholdWidthForMobile }) {
  const [ref, setRef] = useState(null);

  return (
    <>
      <div
        className="observer"
        ref={(node) => {
          if (node !== ref) {
            setRef(node);
          }
        }}
      />
      <Overlay
        isMobileResizable={isMobileResizable}
        observe={ref}
        thresholdWidthForMobile={thresholdWidthForMobile}
      >
        Test content
      </Overlay>
    </>
  );
}
BasicComponent.propTypes = propTypes;
BasicComponent.defaultProps = defaultProps;

describe("Overlay", () => {
  test("should match snapshot.", () => {
    const { container } = render(<Overlay>Test content</Overlay>);
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should react on observe resize.", () => {
    const { container } = render(<BasicComponent />);
    const target = container.querySelector(".observer");

    act(() => {
      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
          target,
        },
      ]);
    });

    expect(container.querySelector(".tm-overlay")).toBe(null);
    expect(container.querySelector(".tm-overlay-mobile")).not.toBe(null);
  });

  test("should force mobile overlay display on big screen.", () => {
    const { container } = render(
      <BasicComponent thresholdWidthForMobile={Infinity} />,
    );
    const target = container.querySelector(".observer");

    act(() => {
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 200,
            width: 1200,
          },
          target,
        },
      ]);
    });

    expect(container.querySelector(".tm-overlay")).toBe(null);
    expect(container.querySelector(".tm-overlay-mobile")).not.toBe(null);
  });

  test("should allow resizing with top handler on mobile.", () => {
    const { container } = render(<BasicComponent />);
    const target = container.querySelector(".observer");

    // Force resize to make it mobile.
    act(() => {
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
          target,
        },
      ]);
    });

    expect(container.querySelector(".tm-overlay-mobile")).not.toBe(null);
    expect(container.querySelector(".tm-overlay-handler")).not.toBe(null);
  });

  test("should not allow resizing with top handler on mobile.", () => {
    const { container } = render(<BasicComponent isMobileResizable={false} />);
    const target = container.querySelector(".observer");

    // Force resize to make it mobile.
    act(() => {
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
          target,
        },
      ]);
    });
    expect(container.querySelector(".tm-overlay-mobile")).not.toBe(null);
    expect(container.querySelector(".tm-overlay-handler")).toBe(null);
  });
});
