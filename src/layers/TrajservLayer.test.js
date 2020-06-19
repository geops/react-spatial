import 'jest-canvas-mock';
import TrajservLayer from './TrajservLayer';

let layer;
let onClick;

describe('VectorLayer', () => {
  beforeEach(() => {
    onClick = jest.fn();
    layer = new TrajservLayer({
      onClick,
    });
  });

  test('should be instanced.', () => {
    expect(layer).toBeInstanceOf(TrajservLayer);
    expect(layer.clickCallbacks[0]).toBe(onClick);
  });

  test('should called terminate on initalization.', () => {
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
