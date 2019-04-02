import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { createStringXY } from 'ol/coordinate';
import OLMousePosition from 'ol/control/MousePosition';
import Select from '../Select';

const propTypes = {
  /**
   * The current map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * CSS class of the checkbox.
   */
  className: PropTypes.string,

  /**
   * List of projections to display.
   */
  projections: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * The label to display in the select box.
       */
      label: PropTypes.string.isRequired,

      /**
       * The value used to create the options´s projection of the MousePosition control.
       * See [doc](https://openlayers.org/en/latest/apidoc/module-ol_control_MousePosition.html).
       */
      value: PropTypes.string.isRequired,

      /**
       * A function following the  [CoordinateFormat](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~CoordinateFormat).
       */
      format: PropTypes.func,
    }),
  ),
};

const defaultProps = {
  className: 'tm-mouse-position',
  projections: [
    {
      label: 'EPSG:4326',
      value: 'EPSG:4326',
    },
    {
      label: 'EPSG:3857',
      value: 'EPSG:3857',
    },
  ],
};

class MousePosition extends PureComponent {
  constructor(props) {
    super(props);
    const { projections } = this.props;
    this.state = {
      projection: projections && projections[0],
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.updateControl();
  }

  componentDidUpdate(prevProps, prevState) {
    const { projection } = this.state;

    if (prevState.projection !== projection) {
      this.updateControl();
    }
  }

  componentWillUnmount() {
    if (this.control) {
      const { map } = this.props;
      map.removeControl(this.control);
    }
  }

  updateControl() {
    const { map } = this.props;
    const { projection } = this.state;

    if (this.control) {
      map.removeControl(this.control);
    }

    if (!projection || !this.ref || !this.ref.current) {
      return;
    }

    this.control = new OLMousePosition({
      coordinateFormat: projection.format || createStringXY(4),
      projection: projection.value,
      target: this.ref.current,
      undefinedHTML: '&nbsp;',
      className: ''
    });
    map.addControl(this.control);
  }

  renderSelect() {
    const { projections } = this.props;
    const { projection } = this.state;
    if (!projections.length) {
      return null;
    }

    return (
      <Select
        options={projections}
        value={projection}
        onChange={(evt, projection) => {
          this.setState({
            projection,
          });
        }}
      />
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        {this.renderSelect()}
        <span ref={this.ref} />
      </div>
    );
  }
}

MousePosition.propTypes = propTypes;
MousePosition.defaultProps = defaultProps;

export default MousePosition;
