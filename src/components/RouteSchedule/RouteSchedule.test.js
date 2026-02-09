import { render } from "@testing-library/react";
import "jest-date-mock";
import { RealtimeLayer as TrackerLayer } from "mobility-toolbox-js/ol";
import React from "react";

import RouteSchedule from ".";

const RealDate = Date;

const lineInfos = {
  backgroundColor: "ff8a00",
  destination: "Station name",
  id: 9959310,
  longName: "T 3",
  operator: "foo",
  operatorUrl: "foo.ch",
  publisher: "bar",
  publisherUrl: "bar.ch",
  routeIdentifier: "03634.003849.004:9",
  shortName: "3",
  stations: [
    {
      aimedArrivalTime: 1571729580000,
      aimedDepartureTime: 1571729580000,
      arrivalDelay: 60000, // +1m
      arrivalTime: 1571729580000 + 60000,
      coordinates: [8.51772, 47.3586],
      departureDelay: 60000,
      departureTime: 1571729580000 + 60000,
      stationId: "1",
      stationName: "first stop",
    },
    {
      aimedArrivalTime: 1571729903000,
      aimedDepartureTime: 1571729903000,
      arrivalDelay: 0, // +0
      arrivalTime: 1571729903000,
      coordinates: [8.54119, 47.36646],
      departureDelay: 120000, // +2m
      departureTime: 1571729903000 + 120000,
      stationId: "2",
      stationName: "second stop",
    },
    {
      aimedArrivalTime: 0,
      aimedDepartureTime: 0,
      arrivalDelay: null, // no realtime
      arrivalTime: 0,
      coordinates: [8.54119, 47.36646],
      departureDelay: null, // no realtime
      departureTime: 0,
      stationId: "4",
      stationName: "no stop",
    },
    {
      aimedArrivalTime: 1571730323000,
      aimedDepartureTime: 0,
      arrivalDelay: 240000, // +4m
      arrivalTime: 1571730323000 + 240000,
      coordinates: [8.54119, 50],
      departureDelay: 0, // +0
      departureTime: 0,
      stationId: "3",
      stationName: "third stop",
    },
  ],
  vehicleType: 0,
};

describe("RouteSchedule", () => {
  beforeEach(() => {
    global.Date = jest.fn(() => {
      return {
        getHours: () => {
          return 9;
        },
        getMinutes: () => {
          return 1;
        },
      };
    });
    Object.assign(Date, RealDate);
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  test("matches snapshots.", () => {
    const trackerLayer = new TrackerLayer({});
    const { container } = render(
      <RouteSchedule
        lineInfos={lineInfos}
        renderHeaderButtons={() => {
          return <div>Button</div>;
        }}
        setCenter={() => {}}
        trackerLayer={trackerLayer}
      />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  // to test: on station click
  // to test: time formating
  // to test: delay formating
  // to test: delay color
  // to test: no arrival delay on first station
  // to test: no arrival date on first station
  // to test: no departure delay on last station
  // to test: no departure date on last station
  // to test: font bold on first and last station
  // to test: custom getDelayString prop
});
