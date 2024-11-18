import { Circle, Fill, Stroke, Style, Text } from "ol/style";

// Default style for Ol
const fill = new Fill({
  color: "rgba(255,255,255,0.4)",
});
const stroke = new Stroke({
  color: "#3399CC",
  width: 1.25,
});
const dfltOlStyle = new Style({
  fill,
  image: new Circle({
    fill,
    radius: 5,
    stroke,
  }),
  stroke,
});

// Default style for KML layer
const kmlFill = new Fill({
  color: [255, 0, 0, 0.7],
});
const kmlStroke = new Stroke({
  color: [255, 0, 0, 1],
  width: 1.5,
});
const kmlcircle = new Circle({
  fill: kmlFill,
  radius: 7,
  stroke: kmlStroke,
});
const kmlStyle = new Style({
  fill: kmlFill,
  image: kmlcircle,
  stroke: kmlStroke,
  text: new Text({
    fill: kmlFill,
    font: "normal 16px Helvetica",
    stroke: new Stroke({
      color: [255, 255, 255, 1],
      width: 3,
    }),
  }),
});

export { kmlStyle };

export default {
  default: dfltOlStyle,
};
