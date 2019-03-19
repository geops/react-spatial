import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OLScaleLine from 'ol/control/ScaleLine';
import OLMap from 'ol/Map';

const propTypes = {
  /**
   * Openlayers map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * CSS class for the container.
   */
  className: PropTypes.string,

  /**
   * Options for ol/control/ScaleLine.
   * See https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html
   */
  options: PropTypes.shape(),
};

const defaultProps = {
  className: 'tm-scale-line',
  options: {},
};

class ScaleLine extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { map, options } = this.props;

    this.control = new OLScaleLine({
      ...options,
      ...{ target: this.ref.current },
    });

    map.addControl(this.control);
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.removeControl(this.control);
  }

  render() {
    const { className } = this.props;
    return <div className={className} ref={this.ref} />;
  }
}

ScaleLine.propTypes = propTypes;
ScaleLine.defaultProps = defaultProps;

export default ScaleLine;
