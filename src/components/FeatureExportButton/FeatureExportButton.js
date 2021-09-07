import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import KMLFormat from 'ol/format/KML';
import { Layer } from 'mobility-toolbox-js/ol';
import KML from '../../utils/KML';

const propTypes = {
  /**
   *  Children content of the Feature export button.
   */
  children: PropTypes.node,

  /**
   * Format to export features (function).
   * Supported formats: https://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
   */
  format: PropTypes.func,

  /**
   * An existing [mobility-toolbox-js Layer](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers),
   * using a valid [ol/source/Vector](https://openlayers.org/en/latest/apidoc/module-ol_source_Vector.html)
   */
  layer: PropTypes.instanceOf(Layer).isRequired,

  /**
   * Map projection.
   */
  projection: PropTypes.string,
};

const defaultProps = {
  children: null,
  format: KMLFormat,
  projection: 'EPSG:3857',
};

/**
 * The FeatureExportButton component creates a button that exports feature geometries
 * from a [[mobility-toolbox-js Layer](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers)]
 * containing an [ol/layer/Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)
 * with a [ol/source/Vector](https://openlayers.org/en/latest/apidoc/module-ol_source_Vector.html) on click.<br>
 * The default export format is KML, which supports the features' style export.<br>
 * Other formats do not always support style export (See specific format specs).
 */
class FeatureExportButton extends PureComponent {
  static createFeatureString(layer, projection, format) {
    if (format === KMLFormat) {
      return KML.writeFeatures(layer, projection);
    }

    // eslint-disable-next-line new-cap
    return new format().writeFeatures(layer.olLayer.getSource().getFeatures(), {
      featureProjection: projection,
    });
  }

  static exportFeatures(layer, projection, format) {
    const now = new Date()
      .toJSON()
      .slice(0, 20)
      .replace(/[.:T-]+/g, '');
    const featString = this.createFeatureString(layer, projection, format);

    const formatString = featString
      ? featString.match(/<(\w+)\s+\w+.*?>/)[1]
      : 'xml';

    const fileName = `exported_features_${now}.${formatString}`;
    const charset = document.characterSet || 'UTF-8';
    const type = `${
      formatString === 'kml'
        ? 'data:application/vnd.google-earth.kml+xml'
        : 'data:text/xml'
    };charset=${charset}`;

    if (featString) {
      if (window.navigator.msSaveBlob) {
        // ie 11 and higher
        window.navigator.msSaveBlob(new Blob([featString], { type }), fileName);
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = `${type},${encodeURIComponent(featString)}`;
        link.click();
      }
    }
  }

  render() {
    const { children, layer, projection, format, ...other } = this.props;

    return (
      <div
        role="button"
        className="rs-feature-export-button"
        tabIndex={0}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
        onClick={() => {
          return FeatureExportButton.exportFeatures(layer, projection, format);
        }}
        onKeyPress={(evt) => {
          return (
            evt.which === 13 &&
            FeatureExportButton.exportFeatures(layer, projection, format)
          );
        }}
      >
        {children}
      </div>
    );
  }
}

FeatureExportButton.propTypes = propTypes;
FeatureExportButton.defaultProps = defaultProps;

export default FeatureExportButton;
