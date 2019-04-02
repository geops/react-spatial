import '../../utils/GlobalsForOle';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { Editor, control } from 'ole';
import { Style } from 'ol/style';
import VectorLayer from '../../VectorLayer';
import Styles from '../../utils/Styles';

const propTypes = {
  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /** An existing react-spatial VectorLayer, using a valid ol.source.Vector */
  layer: PropTypes.instanceOf(VectorLayer),

  /** Control with snapping functionality for geometry alignment, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  cad: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for drawing points, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawPoint: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for drawing lines, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawLineString: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for polygon polygons, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawPolygon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for moving geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  move: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for rotating geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  rotate: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for modifying geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  modify: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for deleting geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  del: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating buffers, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  buffer: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating a union of geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  union: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for intersection geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  intersection: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating a difference of geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  difference: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Style used for all ol.interaction.Select used by controls (delete, buffer, union, difference).
   * This style will be applied on top of the current feature's style or will replace the current layer's style.
   */
  selectStyle: PropTypes.oneOfType([
    PropTypes.instanceOf(Style),
    PropTypes.arrayOf(PropTypes.instanceOf(Style)),
    PropTypes.func,
  ]),

  /* Function triggered when a feature is selected */
  onSelect: PropTypes.func,

  /* Function triggered when a feature is deselected */
  onDeselect: PropTypes.func,
};

const defaultProps = {
  map: undefined,
  layer: undefined,
  cad: false,
  drawPoint: false,
  drawLineString: false,
  drawPolygon: false,
  move: false,
  rotate: false,
  modify: true,
  del: false,
  buffer: false,
  union: false,
  intersection: false,
  difference: false,
  selectStyle: Styles.default,
  onSelect: () => {},
  onDeselect: () => {},
};

/**
 * This component displays a [OpenLayers Editor](http://openlayers-editor.geops.de/).
 */
class OLE extends PureComponent {
  componentDidMount() {
    this.initializeEditor();
  }

  componentDidUpdate(prevProps) {
    const {
      map,
      layer,
      cad,
      drawPoint,
      drawLineString,
      drawPolygon,
      move,
      rotate,
      modify,
      del,
      buffer,
      union,
      intersection,
      difference,
      selectStyle,
      onSelect,
    } = this.props;

    if (
      cad !== prevProps.cad ||
      drawPoint !== prevProps.drawPoint ||
      drawLineString !== prevProps.drawLineString ||
      drawPolygon !== prevProps.drawPolygon ||
      move !== prevProps.move ||
      rotate !== prevProps.rotate ||
      modify !== prevProps.modify ||
      del !== prevProps.del ||
      buffer !== prevProps.buffer ||
      union !== prevProps.union ||
      intersection !== prevProps.intersection ||
      difference !== prevProps.difference
    ) {
      this.initializeEditor();
    }
  }

  componentWillUnmount() {
    this.editor.remove();
  }

  initializeEditor() {
    const ctrls = [];
    const {
      map,
      layer,
      cad,
      drawPoint,
      drawLineString,
      drawPolygon,
      move,
      rotate,
      modify,
      del,
      buffer,
      union,
      intersection,
      difference,
      selectStyle,
      onSelect,
    } = this.props;

    if (!map || !layer || !layer.olLayer || !layer.olLayer.getSource()) {
      return;
    }
    const source = layer.olLayer.getSource();
    const style = selectStyle;

    if (this.editor) {
      this.editor.remove();
    }

    if (drawPoint) {
      ctrls.push(
        new control.Draw(
          Object.assign(
            {
              source,
            },
            drawPoint,
          ),
        ),
      );
    }

    if (drawLineString) {
      ctrls.push(
        new control.Draw(
          Object.assign(
            {
              type: 'LineString',
              source,
            },
            drawLineString,
          ),
        ),
      );
    }

    if (drawPolygon) {
      ctrls.push(
        new control.Draw(
          Object.assign(
            {
              type: 'Polygon',
              source,
            },
            drawPolygon,
          ),
        ),
      );
    }

    if (cad) {
      ctrls.push(
        new control.CAD(
          Object.assign(
            {
              source,
            },
            cad,
          ),
        ),
      );
    }

    if (move) {
      ctrls.push(
        new control.Move(
          Object.assign(
            {
              type: 'Polygon',
              source,
            },
            move,
          ),
        ),
      );
    }

    if (rotate) {
      ctrls.push(
        new control.Rotate(
          Object.assign(
            {
              source,
            },
            rotate,
          ),
        ),
      );
    }

    if (modify) {
      const modifyCtrl = new control.Modify(
        Object.assign(
          {
            source,
            style,
          },
          modify,
        ),
      );
      modifyCtrl.selectInteraction.on('select', e => {
        onSelect(e.selected[e.selected.length - 1], e);
      });
      ctrls.push(modifyCtrl);
    }

    if (buffer) {
      ctrls.push(
        new control.Buffer(
          Object.assign(
            {
              source,
              style,
            },
            buffer,
          ),
        ),
      );
    }

    if (union) {
      ctrls.push(
        new control.Union(
          Object.assign(
            {
              source,
              style,
            },
            union,
          ),
        ),
      );
    }

    if (intersection) {
      ctrls.push(
        new control.Intersection(
          Object.assign(
            {
              source,
              style,
            },
            intersection,
          ),
        ),
      );
    }

    if (difference) {
      ctrls.push(
        new control.Difference(
          Object.assign(
            {
              source,
              style,
            },
            difference,
          ),
        ),
      );
    }

    if (ctrls.length) {
      this.editor = new Editor(map);
      this.editor.addControls(ctrls);
    }
  }

  render() {
    return null;
  }
}

OLE.propTypes = propTypes;
OLE.defaultProps = defaultProps;

export default OLE;
