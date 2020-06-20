import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import OLMap from 'ol/Map';
import { transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';

import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { FaRegDotCircle } from 'react-icons/fa';

const propTypes = {
  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   *  Children content of the Geolocation button.
   */
  children: PropTypes.node,

  /**
   * Map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Function triggered when geolocating is not successful.
   */
  onError: PropTypes.func,

  /**
   * If true, the map is not centered after it has been dragged once.
   */
  noCenterAfterDrag: PropTypes.bool,

  /**
   * If true, the map will constantly recenter to the current Position
   */
  alwaysRecenterToPosition: PropTypes.bool,

  /**
   * Color (Number array with rgb values) or style function.
   * If a color is given, the style is animated.
   */
  colorOrStyleFunc: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.func,
  ]),
};

const defaultProps = {
  className: 'rs-geolocation',
  children: <FaRegDotCircle focusable={false} />,
  onError: () => {},
  noCenterAfterDrag: false,
  alwaysRecenterToPosition: true,
  colorOrStyleFunc: [235, 0, 0],
};

/**
 * This component displays a geolocator.
 */
class Geolocation extends PureComponent {
  constructor(props) {
    super(props);
    const { map, noCenterAfterDrag } = this.props;

    this.layer = new VectorLayer({
      source: new VectorSource(),
    });

    this.isRecenteringToPosition = true;
    if (noCenterAfterDrag) {
      map.on('pointerdrag', () => {
        this.isRecenteringToPosition = false;
      });
    }

    this.state = {
      active: false,
    };
    this.point = undefined;
  }

  componentWillUnmount() {
    this.deactivate();
  }

  toggle() {
    const { active } = this.state;
    const { onError } = this.props;
    const geolocation = 'geolocation' in navigator;

    if (!geolocation) {
      onError();
    } else if (!active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  error() {
    const { onError } = this.props;

    this.deactivate();
    onError();
  }

  deactivate() {
    const { noCenterAfterDrag } = this.props;
    window.clearInterval(this.interval);
    this.layer.setMap(null);
    navigator.geolocation.clearWatch(this.watch);

    if (!noCenterAfterDrag) {
      this.isRecenteringToPosition = true;
    }

    this.setState({
      active: false,
    });
    this.point = undefined;
  }

  activate() {
    const { map } = this.props;

    this.projection = map.getView().getProjection().getCode();
    this.point = new Point([0, 0]);
    this.highlight();
    this.layer.setMap(map);
    this.setState({ active: true });

    this.watch = navigator.geolocation.watchPosition(
      this.update.bind(this),
      this.error.bind(this),
      {
        enableHighAccuracy: true,
      },
    );
  }

  update({ coords: { latitude, longitude } }) {
    const { map, alwaysRecenterToPosition } = this.props;

    const position = transform(
      [longitude, latitude],
      'EPSG:4326',
      this.projection,
    );
    this.point.setCoordinates(position);

    const point = new Point(position);
    this.highlight(point);
    this.layer.setMap(map);
    if (this.isRecenteringToPosition) {
      map.getView().setCenter(position);
      if (!alwaysRecenterToPosition) {
        this.isRecenteringToPosition = false;
      }
    }
  }

  highlight() {
    const { colorOrStyleFunc } = this.props;
    const feature = new Feature({
      geometry: this.point,
    });

    if (Array.isArray(colorOrStyleFunc)) {
      const color = colorOrStyleFunc;

      let decrease = true;
      let opacity = 0.5;
      let rotation = 0;

      window.clearInterval(this.interval);
      this.interval = window.setInterval(() => {
        rotation += 0.03;
        decrease = opacity < 0.1 ? false : decrease;
        decrease = opacity > 0.5 ? true : decrease;
        opacity += decrease ? -0.03 : 0.03;
        if (feature) {
          feature.changed();
        }
      }, 50);

      feature.setStyle(() => {
        const circleStyle = new Style({
          image: new Circle({
            radius: 20,
            rotation,
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.01)',
            }),
            stroke: new Stroke({
              lineDash: [30, 10],
              width: 6,
              color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
            }),
          }),
        });

        circleStyle.getImage().setRotation(rotation);

        return [
          new Style({
            image: new Circle({
              radius: 10,
              fill: new Fill({
                color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`,
              }),
            }),
          }),
          circleStyle,
        ];
      });
    } else {
      feature.setStyle(colorOrStyleFunc);
    }

    this.layer.getSource().clear();
    this.layer.getSource().addFeature(feature);
  }

  render() {
    const { children, className } = this.props;
    // Remove component props from other HTML props.
    const other = Object.entries(this.props).reduce((props, [key, value]) => {
      return propTypes[key] ? props : { ...props, [key]: value };
    }, {});
    const { active } = this.state;

    return (
      <div
        role="button"
        tabIndex="0"
        className={`${className} ${active ? 'rs-active' : ''}`}
        onClick={() => this.toggle()}
        onKeyPress={(e) => e.which === 13 && this.toggle()}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
      >
        {children}
      </div>
    );
  }
}

Geolocation.propTypes = propTypes;
Geolocation.defaultProps = defaultProps;

export default Geolocation;
