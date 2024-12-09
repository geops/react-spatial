import ResizeObserver from "resize-observer-polyfill";

global.URL.createObjectURL = jest.fn(() => {
  return "fooblob";
});

global.ResizeObserver = ResizeObserver;

const noop = () => {};

class Worker {
  onmessage;

  url;

  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = noop;
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}

Object.defineProperty(window, "Worker", {
  value: Worker,
  writable: true,
});
