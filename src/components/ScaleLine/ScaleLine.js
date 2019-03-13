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
   * Options for ol/control/ScaleLine.
   * See https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html
   */
  scaleLineOptions: PropTypes.shape(),
};

const defaultProps = {
  scaleLineOptions: {},
};

class ScaleLine extends Component {
  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
  }

  componentDidMount() {
    const { map, scaleLineOptions } = this.props;

    this.scaleLine = new OLScaleLine({
      ...scaleLineOptions,
      ...{ target: this.elementRef.current },
    });

    map.addControl(this.scaleLine);
  }

  render() {
    return <div className="tm-scale-line" ref={this.elementRef} />;
  }
}

ScaleLine.propTypes = propTypes;
ScaleLine.defaultProps = defaultProps;
export default ScaleLine;
