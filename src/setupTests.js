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

const mock = {
  clearWatch: jest.fn(),
  getCurrentPosition: jest.fn(),
  watchPosition: (onSuccess) => {
    onSuccess({
      coords: {
        accuracy: 55,
        latitude: 47.9913611,
        longitude: 7.84868,
      },
      timestamp: 1552660077044,
    });
  },
};

global.navigator.geolocation = mock;
