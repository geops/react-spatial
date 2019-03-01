import { applyDefaultValues } from './TreeData.esm';

const testData = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: ['topic1'],
      type: 'checkbox',
      data: {
        title: 'root',
      },
    },
    topic1: {
      id: 'topic1',
      isChecked: true,
      isExpanded: true,
      type: 'radio',
      children: ['baselayer1', 'sublayers1', 'sublayers2'],
      data: {
        title: 'Topic 1',
      },
    },
    baselayer1: {
      id: 'baselayer1',
      type: 'checkbox',
      isChecked: true,
      data: {
        title: 'OSM Baselayer',
        type: 'xyz',
      },
    },
    sublayers1: {
      id: 'sublayers1',
      isChecked: true,
      isExpanded: true,
      type: 'radio',
      children: ['usaPop', 'countryBorders'],
      data: {
        title: 'Sub-Layers 1',
      },
    },
    usaPop: {
      id: 'usaPop',
      type: 'checkbox',
      isChecked: true,
      defaults: {
        isChecked: true,
      },
      data: {
        title: 'USA Population Density',
        type: 'wmts',
      },
    },
    countryBorders: {
      id: 'countryBorders',
      type: 'checkbox',
      isChecked: false,
      data: {
        title: 'Countries Borders',
        type: 'vectorLayer',
      },
    },
    sublayers2: {
      id: 'sublayers2',
      isChecked: false,
      isExpanded: true,
      type: 'radio',
      children: ['pointLayer', 'lineLayer', 'polygonLayer'],
      data: {
        title: 'Sub-Layers 2',
      },
    },
    pointLayer: {
      id: 'pointLayer',
      type: 'radio',
      isChecked: false,
      defaults: {
        isChecked: true,
      },
      data: {
        title: 'Points Samples',
        type: 'vectorLayer',
      },
    },
    lineLayer: {
      id: 'lineLayer',
      type: 'radio',
      isChecked: false,
      data: {
        title: 'Lines Samples',
        styleId: 'lineLayer',
        type: 'vectorLayer',
      },
    },
    polygonLayer: {
      id: 'polygonLayer',
      type: 'radio',
      isChecked: false,
      data: {
        title: 'Polygons Samples',
        type: 'vectorLayer',
      },
    },
  },
};

export default applyDefaultValues(testData);
