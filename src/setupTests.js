import ResizeObserver from "resize-observer-polyfill";

global.URL.createObjectURL = jest.fn(() => {
  return "fooblob";
});

global.ResizeObserver = ResizeObserver;
