import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import KML from 'ol/format/KML';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import VectorLayer from '../../VectorLayer';
import Button from '../Button';

import { kmlStyle } from '../../utils/Styles';

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
  className: 'tm-feature-export',
  format: KML,
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
    const { olLayer } = layer;

    let featString;
    const exportFeatures = [];

    olLayer.getSource().forEachFeature(f => {
      // We silently ignore Circle elements as they are
      // not supported in kml
      if (f.getGeometry().getType() === 'Circle') {
        return;
      }

      const clone = f.clone();
      clone.setId(f.getId());
      clone.getGeometry().setProperties(f.getGeometry().getProperties());
      clone.getGeometry().transform(projection, 'EPSG:4326');

      // Extended data breaks KML validty so we remove it for now.
      for (let i = 0; i < f.getProperties(); i += 1) {
        if (/^(geometry|name|description)$/.test(i)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        clone.unset(i, true);
      }

      let styles;

      if (clone.getStyleFunction()) {
        styles = clone.getStyleFunction().call(clone);
      } else {
        styles = olLayer.getStyleFunction().call(olLayer, clone);
      }
      const newStyle = {
        fill: styles[0].getFill(),
        stroke: styles[0].getStroke(),
        text: styles[0].getText(),
        image: styles[0].getImage(),
        zIndex: styles[0].getZIndex(),
      };

      if (newStyle.image instanceof Circle) {
        newStyle.image = null;
      }

      if (newStyle.image) {
        const imgSource = newStyle.image.getSrc();
        if (!/(http(s?)):\/\//gi.test(imgSource)) {
          // eslint-disable-next-line no-console
          console.log(
            "Local image source isn't support for KML export." +
              'Should use remote web server',
          );
        }
      }

      // If only text is displayed we must specify an
      // image style with scale=0
      if (newStyle.text && !newStyle.image) {
        newStyle.image = new Icon({
          src: 'noimage',
          scale: 0,
        });
      }

      const myStyle = new Style(newStyle);
      clone.setStyle(myStyle);
      exportFeatures.push(clone);
    });

    if (exportFeatures.length > 0) {
      if (exportFeatures.length === 1) {
        // force the add of a <Document> node
        exportFeatures.push(new Feature());
      }

      // eslint-disable-next-line new-cap
      featString = new format({
        extractStyles: true,
        defaultStyle: [kmlStyle],
      }).writeFeatures(exportFeatures);

      // Remove no image hack
      featString = featString.replace(
        /<Icon>\s*<href>noimage<\/href>\s*<\/Icon>/g,
        '',
      );

      // Remove empty placemark added to have
      // <Document> tag
      featString = featString.replace(/<Placemark\/>/g, '');

      // Add KML document name
      if (layer.name) {
        featString = featString.replace(
          /<Document>/,
          `<Document><name>${layer.name}</name>`,
        );
      }
    }

    return featString;
  }

  exportFeature() {
    const { layer } = this.props;
    const now = new Date()
      .toJSON()
      .slice(0, 20)
      .replace(/[.:T-]+/g, '');
    const featString = this.createFeatureString(layer);

    const formatString = featString
      ? featString.match(/<(\w+)\s+\w+.*?>/)[1]
      : 'xml';

    const fileName = `exported_features_${now}.${formatString || 'xml'}`;
    const charset = document.characterSet || 'UTF-8';
    const type = `${
      formatString === 'kml'
        ? 'data:application/vnd.google-earth.kml+xml'
        : 'data:text/plain'
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
        onClick={e => this.exportFeature(e)}
      >
        {children}
      </Button>
    );
  }
}

FeatureExportButton.propTypes = propTypes;
FeatureExportButton.defaultProps = defaultProps;

export default FeatureExportButton;
