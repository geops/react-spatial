import getPolygonPattern from './getPolygonPattern';

describe('getPolygonPattern()', () => {
  test('render pattern with default properties (id=1, color = [235, 0, 0, 1])', () => {
    const color = [235, 0, 0, 1];
    const pattern = getPolygonPattern();
    expect(pattern).toEqual(color);
    expect(pattern.id).toBe();
    expect(pattern.color).toBe();
    expect(pattern.empty).toBe();
    expect(pattern.canvas).toBe();
  });

  test('render pattern 0 (no fill) color and (light blue) opacity', () => {
    const id = 0;
    const color = [0, 60, 80, 0.41000000000000003];
    const pattern = getPolygonPattern(id, [0, 60, 80, 0.41000000000000003]);
    expect(pattern.id).toBe(id);
    expect(pattern.color).toEqual(color);
    expect(pattern.empty).toBe(true);
    expect(pattern.canvas).toBe();
  });

  test('render pattern 1 (full by color) color and (light blue) opacity', () => {
    const id = 1;
    const color = [0, 60, 80, 0.41000000000000003];
    const pattern = getPolygonPattern(id, [0, 60, 80, 0.41000000000000003]);
    expect(pattern).toEqual(color);
    expect(pattern.id).toBe();
    expect(pattern.color).toBe();
    expect(pattern.empty).toBe();
    expect(pattern.canvas).toBe();
  });

  test('render pattern 2 (cross) color and (light blue) opacity', () => {
    const id = 2;
    const color = [0, 60, 80, 0.41000000000000003];
    const pattern = getPolygonPattern(id, [0, 60, 80, 0.41000000000000003]);
    expect(pattern.id).toBe(id);
    expect(pattern.color).toEqual(color);
    expect(pattern.empty).toBe();
    expect(pattern.canvas).toMatchSnapshot();
  });

  test('render pattern 3 (diagonal line from bottom-left tot top-right) with color (light blue) and opacity', () => {
    const id = 3;
    const color = [0, 60, 80, 0.41000000000000003];
    const pattern = getPolygonPattern(id, [0, 60, 80, 0.41000000000000003]);
    expect(pattern.id).toBe(id);
    expect(pattern.color).toEqual(color);
    expect(pattern.empty).toBe();
    expect(pattern.canvas).toMatchSnapshot();
  });

  test('render pattern 4 (diagonal line from top-left to bottom-right) with color (light blue) and opacity', () => {
    const id = 4;
    const color = [0, 60, 80, 0.41000000000000003];
    const pattern = getPolygonPattern(id, [0, 60, 80, 0.41000000000000003]);
    expect(pattern.id).toBe(id);
    expect(pattern.color).toEqual(color);
    expect(pattern.empty).toBe();
    expect(pattern.canvas).toMatchSnapshot();
  });
});
