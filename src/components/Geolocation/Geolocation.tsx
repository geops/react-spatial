import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import { unByKey } from "ol/Observable";
import { transform } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { PureComponent } from "react";
import { FaRegDotCircle } from "react-icons/fa";

import type OLMap from "ol/Map";
import type React from "react";

export interface GeolocationProps {
  [key: string]: any;
  /**
   * If true, the map will center once on the position then will constantly recenter to the current Position.
   * If false, the map will center once on the position then will never recenter if the position changes.
   */
  alwaysRecenterToPosition?: boolean;
  /**
   *  Children content of the Geolocation button.
   */
  children?: React.ReactNode;
  /**
   * CSS class of the button.
   */
  className?: string;
  /**
   * Color (Number array with rgb values) or style function.
   * If a color is given, the style is animated.
   */
  colorOrStyleFunc?: ((...args: any[]) => any) | number[];
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: OLMap;
  /**
   * If true, the map will never center to the current position
   */
  neverCenterToPosition?: boolean;
  /**
   * If true, the map is not centered after it has been dragged once.
   */
  noCenterAfterDrag?: boolean;
  /**
   * Function triggered after the geolocation is activated. Takes the ol/map and the component instance as arguments.
   */
  onActivate?: (map: OLMap, instance: any) => void;
  /**
   * Function triggered after the geolocation is deactivated. Takes the ol/map and the component instance as arguments..
   */
  onDeactivate?: (map: OLMap, instance: any) => void;
  /**
   * Function triggered when geolocating is not successful.
   */
  onError?: (error: any) => void;
  /**
   * Function triggered after successful geoLocation calls. Takes the ol/map, the current lat/lon coordinate and the component instance as arguments.
   */
  onSuccess?: (map: OLMap, coords: number[], instance: any) => void;
}

interface GeolocationState {
  active: boolean;
}

const defaultProps = {
  alwaysRecenterToPosition: true,
  children: <FaRegDotCircle focusable={false} />,
  className: "rs-geolocation",
  colorOrStyleFunc: [235, 0, 0],
  neverCenterToPosition: false,
  noCenterAfterDrag: false,
  onActivate: () => {},
  onDeactivate: () => {},
  onError: () => {},
  onSuccess: () => {},
};

/**
 * The GeoLocation component creates a button to display the current device's location on an
 * [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
class Geolocation extends PureComponent<GeolocationProps, GeolocationState> {
  dragListener: any;
  interval: any;
  isRecenteringToPosition: boolean;
  layer: VectorLayer<VectorSource>;
  point: Point | undefined;
  projection: string;
  watch: number;

  constructor(props: GeolocationProps) {
    super(props);

    this.layer = new VectorLayer({
      source: new VectorSource(),
    });

    this.isRecenteringToPosition = true;

    this.state = {
      active: false,
    };
    this.point = undefined;
  }

  activate() {
    const { map, noCenterAfterDrag, onActivate } = this.props;

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

    if (noCenterAfterDrag) {
      this.dragListener = map.on("pointerdrag", () => {
        this.isRecenteringToPosition = false;
      });
    }

    onActivate(map, this);
  }

  componentWillUnmount() {
    this.deactivate();
  }

  deactivate() {
    const { map, onDeactivate } = this.props;
    window.clearInterval(this.interval);
    this.layer.setMap(null);
    navigator.geolocation.clearWatch(this.watch);

    this.setState({
      active: false,
    });

    this.isRecenteringToPosition = true;
    this.point = undefined;
    onDeactivate(map, this);
    unByKey(this.dragListener);
  }

  error(error: any) {
    const { onError } = this.props;

    this.deactivate();
    onError(error);
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
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.01)",
            }),
            radius: 20,
            rotation,
            stroke: new Stroke({
              color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
              lineDash: [30, 10],
              width: 6,
            }),
          }),
        });

        circleStyle.getImage().setRotation(rotation);

        return [
          new Style({
            image: new Circle({
              fill: new Fill({
                color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`,
              }),
              radius: 10,
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
    const other = Object.entries(this.props).reduce(
      (props: any, [key, value]) => {
        return key in defaultProps || key === "map"
          ? props
          : { ...props, [key]: value };
      },
      {},
    );
    const { active } = this.state;

    return (
      <div
        className={`${className} ${active ? "rs-active" : ""}`}
        onClick={() => {
          return this.toggle();
        }}
        onKeyPress={(e) => {
          return e.which === 13 && this.toggle();
        }}
        role="button"
        tabIndex={0}
        {...other}
      >
        {children}
      </div>
    );
  }

  toggle() {
    const { active } = this.state;
    const { onError } = this.props;
    const geolocation = "geolocation" in navigator;

    if (!geolocation) {
      onError(new Error("Geolocation not supported"));
    } else if (!active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  update({ coords: { latitude, longitude } }: GeolocationPosition) {
    const { alwaysRecenterToPosition, map, neverCenterToPosition, onSuccess } =
      this.props;

    const position = transform(
      [longitude, latitude],
      "EPSG:4326",
      this.projection,
    );
    this.point.setCoordinates(position);

    if (!neverCenterToPosition && this.isRecenteringToPosition) {
      map.getView().setCenter(position);
      if (!alwaysRecenterToPosition) {
        this.isRecenteringToPosition = false;
      }
    }

    onSuccess(map, [latitude, longitude], this);
  }
}

(Geolocation as any).defaultProps = defaultProps;

export default Geolocation;
