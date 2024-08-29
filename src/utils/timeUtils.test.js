import { getDelayString, getHoursAndMinutes } from "./timeUtils";

const RealDate = Date;
describe("timeUtils", () => {
  beforeEach(() => {
    global.Date = jest.fn(() => {
      return {
        getHours: () => {
          return 0;
        },
        getMinutes: () => {
          return 2;
        },
      };
    });
    Object.assign(Date, RealDate);
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  test("getHoursAndMinutes should be correct.", () => {
    expect(getHoursAndMinutes(123456)).toBe("00:02");
  });

  test("getDelayString should be correct.", () => {
    expect(getDelayString(123456)).toBe("+2m3s");
  });
});
