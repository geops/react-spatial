import KMLFormat from "ol/format/KML";
import { PureComponent } from "react";

import type Layer from "ol/layer/Layer";
import type React from "react";

export interface FeatureExportButtonProps {
  [key: string]: any;
  /**
   *  Children content of the Feature export button.
   */
  children?: React.ReactNode;
  /**
   * Format to export features (function).
   * Supported formats: https://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
   */
  format?: any;
  /**
   * A layer extending an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer.html),
   * using a valid [ol/source/Vector](https://openlayers.org/en/latest/apidoc/module-ol_source_Vector.html)
   */
  layer: Layer;
  /**
   * Map projection.
   */
  projection?: string;
}

const defaultProps = {
  children: null,
  format: KMLFormat,
  projection: "EPSG:3857",
};

/**
 * The FeatureExportButton component creates a button that exports feature geometries
 * from an [ol/layer/Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)
 * with a [ol/source/Vector](https://openlayers.org/en/latest/apidoc/module-ol_source_Vector.html) on click.<br>
 * The default export format is KML, which supports the features' style export.<br>
 * Other formats do not always support style export (See specific format specs).
 */
class FeatureExportButton extends PureComponent<FeatureExportButtonProps> {
  static createFeatureString(layer: any, projection: string, format: any) {
    return new format().writeFeatures(layer.getSource().getFeatures(), {
      featureProjection: projection,
    });
  }

  static exportFeatures(layer: any, projection: string, format: any) {
    const now = new Date()
      .toJSON()
      .slice(0, 20)
      .replace(/[.:T-]+/g, "");
    const featString = this.createFeatureString(layer, projection, format);

    const formatString = featString
      ? featString.match(/<(\w+)\s+\w+.*?>/)[1]
      : "xml";

    const fileName = `exported_features_${now}.${formatString}`;
    const charset = document.characterSet || "UTF-8";
    const type = `${
      formatString === "kml"
        ? "data:application/vnd.google-earth.kml+xml"
        : "data:text/xml"
    };charset=${charset}`;

    if (featString) {
      if ((window.navigator as any).msSaveBlob) {
        // ie 11 and higher
        (window.navigator as any).msSaveBlob(
          new Blob([featString], { type }),
          fileName,
        );
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = `${type},${encodeURIComponent(featString)}`;
        link.click();
      }
    }
  }

  render() {
    const { children, format, layer, projection, ...other } = this.props;

    return (
      <div
        className="rs-feature-export-button"
        role="button"
        tabIndex={0}
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

(FeatureExportButton as any).defaultProps = defaultProps;

export default FeatureExportButton;
