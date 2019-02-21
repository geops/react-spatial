import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

const data = {
  child31: new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: '#ff0000',
      }),
    }),
  }),
  child32: new Style({
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2,
    }),
  }),
  child33: new Style({
    stroke: new Stroke({
      color: '#7dff8f',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(125, 255, 143, 0.2)',
    }),
  }),
};

export default data;
