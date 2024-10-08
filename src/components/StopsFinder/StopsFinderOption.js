/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress, styled } from "@mui/material";
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

const StyledFlex = styled("div")(() => ({
  alignItems: "center",
  display: "flex",
  gap: 5,
}));

function StopsFinderOption({ option, ...props }) {
  return (
    <Suspense fallback={<CircularProgress size={20} />}>
      <StyledFlex {...props}>
        {Object.entries(option.properties?.mot).map(([key, value]) => {
          if (value) {
            const MotIcon = iconForMot[key];
            return (
              <StyledFlex key={key}>
                <MotIcon />
              </StyledFlex>
            );
          }
          return null;
        })}
        <span>{option.properties.name}</span>
      </StyledFlex>
    </Suspense>
  );
}

StopsFinderOption.propTypes = {
  option: PropTypes.object.isRequired,
};

export default React.memo(StopsFinderOption);
