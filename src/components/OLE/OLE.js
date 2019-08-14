import '../../utils/GlobalsForOle';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { Editor, control } from 'ole';
import { Style } from 'ol/style';
import Layer from '../../Layer';

const propTypes = {
  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /** An existing react-spatial VectorLayer, using a valid ol.source.Vector */
  layer: PropTypes.instanceOf(Layer),

  /** Function to render custom button, instead of default toolbar. */
  renderControlButton: PropTypes.func,

  /** Control with snapping functionality for geometry alignment, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  cad: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for drawing points, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawPoint: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Array of draw options to create custom more drawing controls, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawCustoms: PropTypes.arrayOf(PropTypes.object),

  /** Control for drawing lines, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawLineString: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for polygon polygons, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  drawPolygon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for rotating geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  rotate: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for modifying geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to true. */
  modify: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating buffers, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  buffer: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating a union of geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  union: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for intersection geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  intersection: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /** Control for creating a difference of geometries, see [doc](http://openlayers-editor.geops.de/api.html). Default to false. */
  difference: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /**
   * Style used for all ol.interaction.Select used by controls (delete, buffer, union, difference).
   * This style will be applied on top of the current feature's style or will replace the current layer's style.
   */
  selectStyle: PropTypes.oneOfType([
    PropTypes.instanceOf(Style),
    PropTypes.arrayOf(PropTypes.instanceOf(Style)),
    PropTypes.func,
  ]),

  modifyStyle: PropTypes.oneOfType([
    PropTypes.instanceOf(Style),
    PropTypes.arrayOf(PropTypes.instanceOf(Style)),
    PropTypes.func,
  ]),

  /** Function triggered when a feature is selected */
  onSelect: PropTypes.func,

  /** Function triggered when a feature is deselected */
  onDeselect: PropTypes.func,

  /** Function triggered when a contol is activated */
  onControlActive: PropTypes.func,

  /** Function triggered when a contol is deactivated */
  onControlDeactive: PropTypes.func,

  /* CSS class of the container */
  className: PropTypes.string,
};

const defaultProps = {
  map: undefined,
  layer: undefined,
  renderControlButton: null,
  cad: false,
  drawPoint: true,
  drawCustoms: [],
  drawLineString: true,
  drawPolygon: false,
  rotate: false,
  modify: true,
  buffer: false,
  union: false,
  intersection: false,
  difference: false,
  selectStyle: null,
  modifyStyle: null,
  onSelect: () => {},
  onDeselect: () => {},
  onControlActive: () => {},
  onControlDeactive: () => {},
  className: 'tm-ole',
};

/**
 * This component displays a [OpenLayers Editor](http://openlayers-editor.geops.de/).
 */
class OLE extends PureComponent {
  static defineOptions(type, parameters) {
    return { type, ...parameters };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.initializeEditor();
  }

  componentDidUpdate(prevProps) {
    const {
      cad,
      drawPoint,
      drawCustoms,
      drawLineString,
      drawPolygon,
      rotate,
      modify,
      buffer,
      union,
      intersection,
      difference,
    } = this.props;

    if (
      cad !== prevProps.cad ||
      drawPoint !== prevProps.drawPoint ||
      drawCustoms !== prevProps.drawCustoms ||
      drawLineString !== prevProps.drawLineString ||
      drawPolygon !== prevProps.drawPolygon ||
      rotate !== prevProps.rotate ||
      modify !== prevProps.modify ||
      buffer !== prevProps.buffer ||
      union !== prevProps.union ||
      intersection !== prevProps.intersection ||
      difference !== prevProps.difference
    ) {
      this.initializeEditor();
    }
  }

  componentWillUnmount() {
    const { editor } = this.state;
    editor.remove();
  }

  initializeEditor() {
    const ctrls = [];
    const {
      map,
      layer,
      renderControlButton,
      cad,
      drawPoint,
      drawCustoms,
      drawLineString,
      drawPolygon,
      rotate,
      modify,
      buffer,
      union,
      intersection,
      difference,
      selectStyle,
      modifyStyle,
      onSelect,
      onDeselect,
      onControlActive,
      onControlDeactive,
    } = this.props;

    const { editor } = this.state;

    if (
      !this.ref ||
      !this.ref.current ||
      !map ||
      !layer ||
      !layer.olLayer ||
      !layer.olLayer.getSource()
    ) {
      return;
    }

    const source = layer.olLayer.getSource();
    const style = selectStyle;
    const element = renderControlButton ? document.createElement('div') : null;

    if (editor) {
      editor.remove();
    }

    if (drawPolygon) {
      drawCustoms.unshift(OLE.defineOptions('Polygon', drawPolygon));
    }

    if (drawLineString) {
      drawCustoms.unshift(OLE.defineOptions('LineString', drawLineString));
    }

    if (drawPoint) {
      drawCustoms.unshift(drawPoint);
    }

    drawCustoms.forEach(opt => {
      const draw = new control.Draw({
        source,
        element,
        ...opt,
      });

      if (opt.onDrawStart) {
        draw.drawInteraction.on('drawstart', opt.onDrawStart);
      }

      if (opt.onDrawEnd) {
        draw.drawInteraction.on('drawend', opt.onDrawEnd);
      }

      ctrls.push(draw);
    });

    if (cad) {
      ctrls.push(
        new control.CAD({
          source,
          element,
          ...cad,
        }),
      );
    }

    if (rotate) {
      ctrls.push(
        new control.Rotate({
          source,
          element,
          ...rotate,
        }),
      );
    }

    if (modify) {
      const modifyCtrl = new control.Modify({
        source,
        style,
        modifyStyle,
        element,
        ...modify,
      });

      modifyCtrl.selectMove.getFeatures().on('add', evt => {
        onSelect(evt.element);
      });

      modifyCtrl.selectMove.getFeatures().on('remove', evt => {
        onDeselect(evt.element);
      });

      modifyCtrl.selectModify.getFeatures().on('add', evt => {
        onSelect(evt.element);
      });

      modifyCtrl.selectModify.getFeatures().on('remove', evt => {
        onDeselect(evt.element);
      });

      ctrls.push(modifyCtrl);
    }

    if (buffer) {
      ctrls.push(
        new control.Buffer({
          source,
          style,
          element,
          ...buffer,
        }),
      );
    }

    if (union) {
      ctrls.push(
        new control.Union({
          source,
          style,
          element,
          ...union,
        }),
      );
    }

    if (intersection) {
      ctrls.push(
        new control.Intersection({
          source,
          style,
          element,
          ...intersection,
        }),
      );
    }

    if (difference) {
      ctrls.push(
        new control.Difference({
          source,
          style,
          element,
          ...difference,
        }),
      );
    }
    if (ctrls.length) {
      const newEditor = new Editor(map, {
        target: this.ref.current,
        // Hide ole toolbar if pass custom one.
        showToolbar: !renderControlButton,
      });

      newEditor.getActiveControls().on('add', onControlActive);
      newEditor.getActiveControls().on('remove', onControlDeactive);
      newEditor.addControls(ctrls);
      this.setState({ editor: newEditor });
    }
  }

  render() {
    const { renderControlButton, className } = this.props;
    const { editor } = this.state;
    const content =
      renderControlButton && editor ? (
        <div ref={this.ref} className={className}>
          {editor
            .getControls()
            .getArray()
            .map(c => {
              return renderControlButton(c);
            })}
        </div>
      ) : null;

    return (
      <div ref={this.ref} className={className}>
        {content}
      </div>
    );
  }
}

OLE.propTypes = propTypes;
OLE.defaultProps = defaultProps;

export default OLE;
