import { Fill, Stroke, Circle, Style, Text } from 'ol/style';

// Default style for Ol
const fill = new Fill({
  color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});
const dfltOlStyle = new Style({
  image: new Circle({
    fill,
    stroke,
    radius: 5,
  }),
  fill,
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
  radius: 7,
  fill: kmlFill,
  stroke: kmlStroke,
});
const kmlStyle = new Style({
  fill: kmlFill,
  stroke: kmlStroke,
  image: kmlcircle,
  text: new Text({
    font: 'normal 16px Helvetica',
    fill: kmlFill,
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
