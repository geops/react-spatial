import { OL3Parser } from "jsts/org/locationtech/jts/io";
import { BufferOp } from "jsts/org/locationtech/jts/operation/buffer";
import { OverlayOp } from "jsts/org/locationtech/jts/operation/overlay";
import Collection from "ol/Collection";
import Control from "ol/control/Control";
import * as events from "ol/events";
import * as condition from "ol/events/condition";
import { getCenter } from "ol/extent";
import Feature from "ol/Feature";
import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "ol/geom";
import LinearRing from "ol/geom/LinearRing";
import { fromExtent } from "ol/geom/Polygon";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Pointer from "ol/interaction/Pointer";
import Select from "ol/interaction/Select";
import Snap from "ol/interaction/Snap";
import OLVectorLayer from "ol/layer/Vector";
import Observable, { unByKey } from "ol/Observable";
import VectorSource from "ol/source/Vector";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import RegularShape from "ol/style/RegularShape";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

/**
 * This module create window.ol and window.jsts variables for ole editor.
 */
if (!window.ol) {
  window.ol = {
    Collection,
    control: {
      Control,
    },
    events: {
      ...events,
      condition: {
        ...condition,
      },
    },
    extent: {
      getCenter,
    },
    Feature,
    geom: {
      LinearRing,
      LineString,
      MultiLineString,
      MultiPoint,
      MultiPolygon,
      Point,
      Polygon,
    },
    interaction: {
      Draw,
      Modify,
      Pointer,
      Select,
      Snap,
    },
    layer: {
      Vector: OLVectorLayer,
    },
    Observable: {
      ...Observable,
      unByKey,
    },
    source: {
      Vector: VectorSource,
    },
    style: {
      Circle,
      Fill,
      Icon,
      RegularShape,
      Stroke,
      Style,
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
