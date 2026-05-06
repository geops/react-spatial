import PropTypes from "prop-types";
import React, { lazy, Suspense } from "react";

const ext = "_round-blue-01.svg";
const iconForMot = {};
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

function StopsFinderOption({ option, ...props }) {
  return (
    <Suspense fallback={option.loadingComp}>
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

StopsFinderOption.propTypes = {
  loadingComp: PropTypes.element,
  option: PropTypes.object.isRequired,
};

export default React.memo(StopsFinderOption);
