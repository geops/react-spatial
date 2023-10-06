import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Control from "ol/control/Control";
import Draw from "ol/interaction/Draw";
import Snap from "ol/interaction/Snap";
import Pointer from "ol/interaction/Pointer";
import Select from "ol/interaction/Select";
import Modify from "ol/interaction/Modify";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Icon from "ol/style/Icon";
import RegularShape from "ol/style/RegularShape";
import Collection from "ol/Collection";
import Feature from "ol/Feature";
import Observable, { unByKey } from "ol/Observable";
import { getCenter } from "ol/extent";
import {
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
} from "ol/geom";
import LinearRing from "ol/geom/LinearRing";
import { fromExtent } from "ol/geom/Polygon";
import * as events from "ol/events";
import * as condition from "ol/events/condition";
import { OL3Parser } from "jsts/org/locationtech/jts/io";
import { BufferOp } from "jsts/org/locationtech/jts/operation/buffer";
import { OverlayOp } from "jsts/org/locationtech/jts/operation/overlay";

/**
 * This module create window.ol and window.jsts variables for ole editor.
 */
if (!window.ol) {
  window.ol = {
    Feature,
    Collection,
    layer: {
      Vector: OLVectorLayer,
    },
    source: {
      Vector: VectorSource,
    },
    interaction: {
      Draw,
      Snap,
      Pointer,
      Select,
      Modify,
    },
    control: {
      Control,
    },
    style: {
      Style,
      Fill,
      Stroke,
      Circle,
      RegularShape,
      Icon,
    },
    geom: {
      Point,
      LineString,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon,
      LinearRing,
    },
    extent: {
      getCenter,
    },
    Observable: {
      ...Observable,
      unByKey,
    },
    events: {
      ...events,
      condition: {
        ...condition,
      },
    },
  };
  window.ol.geom.Polygon.fromExtent = fromExtent;
}

if (!window.jsts) {
  window.jsts = {
    io: {
      OL3Parser,
    },
    operation: { buffer: { BufferOp }, overlay: { OverlayOp } },
  };
}
