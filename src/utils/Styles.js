import { Fill, Stroke, Circle, Style } from 'ol/style';

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

export default {
  default: dfltOlStyle,
};
