import 'jest-canvas-mock';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OLLayer from 'ol/layer/Layer';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import OSMSource from 'ol/source/OSM';
import TileJSONSource from 'ol/source/TileJSON';
import ConfigReader from './ConfigReader';
import Layer from './Layer';

describe('ConfigReader', () => {
  describe('readConfig()', () => {
    test('create XYZ layer', () => {
      const layers = ConfigReader.readConfig([
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
      const layers = ConfigReader.readConfig([
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
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBeInstanceOf(OLVectorLayer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(VectorSource);
    });

    test('create WMTS layer', () => {
      const layers = ConfigReader.readConfig([
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

    test('create tileJSON layer', () => {
      const layers = ConfigReader.readConfig([
        {
          name: 'Custom OSM Layer',
          visible: true,
          data: {
            type: 'tileJSON',
            url:
              'https://api.tiles.mapbox.com/' +
              'v3/mapbox.geography-class.json?secure',
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(TileJSONSource);
    });

    test('create Mapbox layer', () => {
      const layers = ConfigReader.readConfig([
        {
          name: 'OSM Baselayer',
          data: {
            type: 'mapbox',
            url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer).toBeInstanceOf(OLLayer);
      expect(layers[0].styleUrl).toBe(
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      );
    });

    test('create custom layer', () => {
      const layers = ConfigReader.readConfig([
        {
          name: 'Custom OSM Layer',
          visible: true,
          data: {
            type: 'custom',
            layer: new TileLayer({
              source: new OSMSource(),
            }),
          },
        },
      ]);
      expect(layers[0]).toBeInstanceOf(Layer);
      expect(layers[0].olLayer.getSource()).toBeInstanceOf(OSMSource);
    });

    test('create empty layer', () => {
      const layers = ConfigReader.readConfig([
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
      const layers = ConfigReader.readConfig([
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

    test('returns an empty array', () => {
      const layers = ConfigReader.readConfig([]);
      expect(layers.length).toEqual(0);
    });
  });
});
