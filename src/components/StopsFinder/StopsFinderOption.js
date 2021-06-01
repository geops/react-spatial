import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const ext = '_round-blue-01.svg';
const iconForMot = {};
[
  'bus',
  'ferry',
  'gondola',
  'tram',
  'rail',
  'funicular',
  'cable_car',
  'subway',
].forEach((mot) => {
  iconForMot[mot] = lazy(() => import(`../../images/mots/${mot}${ext}`));
});

const useStyles = makeStyles((theme) => {
  return {
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: theme.spacing(2),
    },
  };
});

function StopsFinderOption({ option }) {
  const classes = useStyles();

  return (
    <Suspense fallback={<div />}>
      <div className={classes.flex}>
        {Object.entries(option.properties.mot).map(([key, value]) => {
          if (value) {
            const MotIcon = iconForMot[key];
            return (
              <span className={classes.icon}>
                <MotIcon />
              </span>
            );
          }
          return <></>;
        })}
        <span>{option.properties.name}</span>
      </div>
    </Suspense>
  );
}

StopsFinderOption.propTypes = {
  option: PropTypes.object.isRequired,
};

export default React.memo(StopsFinderOption);
