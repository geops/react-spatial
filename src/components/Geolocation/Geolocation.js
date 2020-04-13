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

    this.isCentered = true;
    if (noCenterAfterDrag) {
      map.on('pointerdrag', () => {
        this.isCentered = false;
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
      this.watch = navigator.geolocation.watchPosition(
        this.update.bind(this),
        this.error.bind(this),
        {
          enableHighAccuracy: true,
        },
      );
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
    window.clearInterval(this.interval);
    this.layer.setMap(null);
    navigator.geolocation.clearWatch(this.watch);

    this.setState({
      active: false,
    });
    this.point = undefined;
  }

  activate(latitude, longitude) {
    const { map } = this.props;

    this.projection = map.getView().getProjection().getCode();
    const position = transform(
      [longitude, latitude],
      'EPSG:4326',
      this.projection,
    );
    this.point = new Point(position);
    this.highlight();
    this.layer.setMap(map);
    this.setState({ active: true });
  }

  update({ coords: { latitude, longitude } }) {
    const { map } = this.props;
    const { active } = this.state;

    if (!active) {
      this.activate(longitude, latitude);
    }

    const position = transform(
      [longitude, latitude],
      'EPSG:4326',
      this.projection,
    );
    this.point.setCoordinates(position);

    if (this.isCentered) {
      map.getView().setCenter(position);
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
