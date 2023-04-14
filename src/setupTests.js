global.URL.createObjectURL = jest.fn(() => {
  return 'fooblob';
});

/* eslint-disable */
class ResizeObserver {
  constructor(onResize) {
    ResizeObserver.onResize = onResize;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
