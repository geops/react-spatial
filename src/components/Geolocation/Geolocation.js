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

import Button from '../Button';

const propTypes = {
  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * Title of the button.
   */
  title: PropTypes.string,

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
  title: undefined,
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
  }

  toggle() {
    const { active } = this.state;
    const { onError } = this.props;
    const geolocation = 'geolocation' in navigator;

    if (!geolocation) {
      onError();
    } else if (!active) {
      this.watch = navigator.geolocation.watchPosition(
        this.activate.bind(this),
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
  }

  activate(position) {
    const { map } = this.props;

    const code = map
      .getView()
      .getProjection()
      .getCode();
    const pos = transform(
      [position.coords.longitude, position.coords.latitude],
      'EPSG:4326',
      code,
    );

    const point = new Point(pos);
    this.highlight(point);
    this.layer.setMap(map);
    if (this.isCentered) {
      map.getView().setCenter(pos);
    }

    this.setState({
      active: true,
    });
  }

  highlight(point) {
    const { colorOrStyleFunc } = this.props;

    let decrease = true;
    let opacity = 0.5;
    let rotation = 0;
    let feature;

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

    feature = new Feature({
      geometry: point,
      source: new VectorSource(),
    });

    if (Array.isArray(colorOrStyleFunc)) {
      const color = colorOrStyleFunc;

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
    const { className, title } = this.props;
    const { active } = this.state;

    return (
      <Button
        className={`${className} ${active ? 'rs-blink' : ''}`}
        title={title}
        onClick={() => this.toggle()}
      >
        <FaRegDotCircle focusable={false} />
      </Button>
    );
  }
}

Geolocation.propTypes = propTypes;
Geolocation.defaultProps = defaultProps;

export default Geolocation;
