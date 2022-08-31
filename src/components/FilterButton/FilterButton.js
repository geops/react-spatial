import React, { PureComponent } from 'react';
import qs from 'query-string';
import PropTypes from 'prop-types';
import { RealtimeLayer as TrackerLayer } from 'mobility-toolbox-js/ol';

const propTypes = {
  /**
   * CSS class of the filter button.
   */
  className: PropTypes.string,

  /**
   * Title.
   */
  title: PropTypes.string,

  /**
   * Line info route identifer.
   */
  routeIdentifier: PropTypes.string.isRequired,

  /**
   * Button is active.
   */
  active: PropTypes.bool.isRequired,

  /**
   * Function triggered on button click.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Trackerlayer.
   */
  trackerLayer: PropTypes.instanceOf(TrackerLayer).isRequired,

  /**
   * Children content of the button.
   */
  children: PropTypes.element.isRequired,
};

const defaultProps = {
  className: 'rt-route-filter',
  title: 'Filter',
};

/**
 * Button enables the filtering of a selected train.
 */
class FilterButton extends PureComponent {
  updatePermalink(isRemoving) {
    const { routeIdentifier } = this.props;

    const parameters = qs.parse(window.location.search.toLowerCase());
    if (isRemoving) {
      delete parameters.tripnumber;
    } else {
      parameters.tripnumber = parseInt(routeIdentifier.split('.')[0], 10);
    }

    const qStr = qs.stringify(parameters, { encode: false });
    const search = `?${qStr}`;
    const { hash } = window.location;
    window.history.replaceState(undefined, undefined, `${search}${hash || ''}`);
  }

  toggleFilter(routeIdentifier) {
    const { trackerLayer, active, onClick } = this.props;
    const activated = !active;

    if (trackerLayer) {
      if (activated) {
        this.updatePermalink(false);
        [trackerLayer.tripNumber] = routeIdentifier.split('.');
      } else {
        this.updatePermalink(true);
        trackerLayer.tripNumber = null;
      }
    }

    onClick(activated);
  }

  render() {
    const { className, title, routeIdentifier, active, children } = this.props;
    const toggle = () => {
      return this.toggleFilter(routeIdentifier);
    };

    return (
      <div
        aria-label={title}
        className={`${className}${active ? ' rt-active' : ''}`}
        title={title}
        onClick={toggle}
        onKeyPress={(e) => {
          return e.which === 13 && toggle();
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
}

FilterButton.propTypes = propTypes;
FilterButton.defaultProps = defaultProps;

export default FilterButton;
