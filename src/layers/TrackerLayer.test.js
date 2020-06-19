import 'jest-canvas-mock';
import TrackerLayer from './TrackerLayer';

let layer;
let onClick;

describe('VectorLayer', () => {
  beforeEach(() => {
    onClick = jest.fn();
    layer = new TrackerLayer({
      onClick,
    });
  });

  test('should be instanced.', () => {
    expect(layer).toBeInstanceOf(TrackerLayer);
    expect(layer.clickCallbacks[0]).toBe(onClick);
  });

  test('should called terminate on initalization.', () => {
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('#onClick', () => {
    const f = () => {};
    layer.onClick(f);
    expect(layer.clickCallbacks[1]).toBe(f);
    expect(layer.clickCallbacks.length).toBe(2);
    layer.onClick(f);
    expect(layer.clickCallbacks.length).toBe(2);
  });

  test('#unClick', () => {
    const foo = () => {};
    const bar = () => {};
    layer.onClick(foo);
    layer.onClick(bar);
    expect(layer.clickCallbacks[1]).toBe(foo);
    expect(layer.clickCallbacks[2]).toBe(bar);
    expect(layer.clickCallbacks.length).toBe(3);
    layer.unClick(foo);
    expect(layer.clickCallbacks[1]).toBe(bar);
    expect(layer.clickCallbacks.length).toBe(2);
  });
});
