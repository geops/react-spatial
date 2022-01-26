import { getHoursAndMinutes, getDelayString } from './timeUtils';

describe('timeUtils', () => {
  test('getHoursAndMinutes should be correct.', () => {
    expect(getHoursAndMinutes(123456)).toBe('01:02');
  });

  test('getDelayString should be correct.', () => {
    expect(getDelayString(123456)).toBe('2m3s');
  });
});
