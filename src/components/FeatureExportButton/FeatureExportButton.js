import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import KMLFormat from 'ol/format/KML';
import VectorLayer from '../../VectorLayer';
import Button from '../Button';
import KML from '../../utils/KML';

const propTypes = {
  /**
   *  Children content of the Feature export button.
   */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * CSS class of the Feature export button.
   */
  className: PropTypes.string,

  /**
   * Format to export features (function).
   * Supported formats: https://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
   */
  format: PropTypes.func,

  /** An existing react-spatial VectorLayer, using a valid ol.source.Vector */
  layer: PropTypes.instanceOf(VectorLayer).isRequired,

  /**
   * Map projection.
   */
  projection: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * Title of the Feature export button.
   */
  title: PropTypes.string,
};

const defaultProps = {
  children: <FaCloudDownloadAlt focusable={false} />,
  className: 'tm-button tm-feature-export',
  format: KMLFormat,
  projection: 'EPSG:3857',
  tabIndex: 0,
  title: undefined,
};

/**
 * This component displays a button to export geometry feature.<br>
 * Default export format is KML, which supported features' style export.<br>
 * Other formats do not always support style export (See specific format specs).
 */
class FeatureExportButton extends PureComponent {
  createFeatureString(layer) {
    const { projection, format } = this.props;

    if (format === KMLFormat) {
      return KML.writeFeatures(layer, projection);
    }

    const featuresToExport = [];

    layer.olLayer.getSource().forEachFeature(f => {
      f.getGeometry().transform(projection, 'EPSG:4326');
      featuresToExport.push(f);
    });
    // eslint-disable-next-line new-cap
    return new format({
      featureProjection: projection,
    }).writeFeatures(featuresToExport);
  }

  exportFeatures() {
    const { layer } = this.props;
    const now = new Date()
      .toJSON()
      .slice(0, 20)
      .replace(/[.:T-]+/g, '');
    const featString = this.createFeatureString(layer);

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
    const { title, children, tabIndex, className } = this.props;

    return (
      <Button
        className={className}
        title={title}
        tabIndex={tabIndex}
        onClick={() => this.exportFeatures()}
      >
        {children}
      </Button>
    );
  }
}

FeatureExportButton.propTypes = propTypes;
FeatureExportButton.defaultProps = defaultProps;

export default FeatureExportButton;
