import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import ConfigReader from './ConfigReader';
import Layer from './Layer';
import VectorLayer from './VectorLayer';

describe('ConfigReader', () => {
  describe('readConfig()', () => {
    test('create XYZ layer', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [
        {
          name: 'OSM Baselayer',
          data: {
            type: 'xyz',
            url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBeInstanceOf(TileLayer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(XYZ);
    });

    test('create Vector layer', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [
        {
          name: 'Countries Borders',
          data: {
            type: 'vectorLayer',
            url:
              'https://openlayers.org/en/latest/examples/data/geojson/' +
              'countries.geojson',
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(VectorLayer);
      expect(layers[0].olLayer).toBeInstanceOf(OLVectorLayer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(VectorSource);
    });

    test('create WMTS layer', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [
        {
          name: 'USA Population Density',
          visible: true,
          data: {
            type: 'wmts',
            url:
              'https://services.arcgisonline.com/arcgis/rest/services/' +
              'Demographics/USA_Population_Density/MapServer/WMTS/?layer=0' +
              '&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&' +
              'Request=GetTile&Version=1.0.0&Format=image%2Fpng&',
            projection: 'EPSG:3857',
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBeInstanceOf(TileLayer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(WMTSSource);
    });

    test('create empty layer', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [
        {
          name: 'USA Population Density',
          visible: true,
          data: {},
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBe();
    });

    test('add children', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [
        {
          name: 'USA Population Density',
          visible: true,
          children: [{ name: '1' }, { name: '2' }],
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBe();
      expect(layers[0].getChildren().length).toBe(2);
    });

    test('apply some default (we test here that there is no error with an empty object)', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, [{}]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBe();
      expect(layers[0].getChildren().length).toBe(0);
    });

    test('returns an empty array', () => {
      const map = new OLMap();
      const layers = ConfigReader.readConfig(map, []);
      expect(layers.length).toEqual(0);
    });
  });
});
