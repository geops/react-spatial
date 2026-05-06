import React, { lazy, Suspense } from "react";

import type { StopsFinderOption } from "./StopsFinder";

const ext = "_round-blue-01.svg";
const iconForMot: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<unknown>>
> = {};
[
  "bus",
  "ferry",
  "gondola",
  "tram",
  "rail",
  "funicular",
  "cable_car",
  "subway",
].forEach((mot) => {
  iconForMot[mot] = lazy(() => {
    return import(`../../images/mots/${mot}${ext}`);
  });
});

export interface StopsFinderOptionProps {
  loadingComp?: React.ReactElement;
  option: StopsFinderOption;
}

function StopsFinderOption({
  loadingComp,
  option,
  ...props
}: StopsFinderOptionProps) {
  return (
    <Suspense fallback={loadingComp}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 10,
        }}
        {...props}
      >
        {Object.entries(option.properties?.mot)
          .filter(([, value]) => {
            return !!value;
          })
          .map(([key]) => {
            const MotIcon = iconForMot[key];
            return <MotIcon key={key} />;
          })}
        <span>{option.properties.name}</span>
      </div>
    </Suspense>
  );
}

export default React.memo(StopsFinderOption);
