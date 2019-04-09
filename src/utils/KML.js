import KML from 'ol/format/KML';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { Style, Text, Icon, Circle } from 'ol/style';
import { kmlStyle } from './Styles';

// Clean the uneeded feature's style and properties created by the KML parser.
const sanitizeFeature = feature => {
  const geom = feature.getGeometry();
  let styles = feature.getStyleFunction().call(feature);

  // The use of clone is part of the scale fix line 156
  const style = styles[0].clone();

  // The canvas draws a stroke width=1 by default if width=0, so we
  // remove the stroke style in that case.
  let stroke = style.getStroke();
  if (stroke && stroke.getWidth() === 0) {
    stroke = undefined;
  }

  // if the feature is a Point and we are offline, we use default vector
  // style.
  // if the feature is a Point and has a name with a text style, we
  // create a correct text style.
  // TODO Handle GeometryCollection displaying name on the first Point
  // geometry.
  if (style && (geom instanceof Point || geom instanceof MultiPoint)) {
    let image = style.getImage();
    let text = null;
    let fill = style.getFill();

    // If the feature has name we display it on the map as Google does
    if (
      feature.get('name') &&
      style.getText() &&
      style.getText().getScale() !== 0
    ) {
      if (image && image.getScale() === 0) {
        // transparentCircle is used to allow selection
        image = this.gaStyleFactory.getStyle('transparentCircle');
      }

      text = new Text({
        font: this.gaStyleFactory.FONT,
        text: feature.get('name'),
        fill: style.getText().getFill(),
        stroke: this.gaStyleFactory.getTextStroke(
          style
            .getText()
            .getFill()
            .getColor(),
        ),
        scale: style.getText().getScale(),
      });

      if (image instanceof Icon) {
        this.gaStyleFactory.applyTextStyleForIcon(image, text);
      }

      fill = undefined;
      stroke = undefined;
    }

    styles = [
      new Style({
        fill,
        stroke,
        image,
        text,
        zIndex: style.getZIndex(),
      }),
    ];
    feature.setStyle(styles);
  }

  // Remove image and text styles for polygons and lines
  if (
    !(
      geom instanceof Point ||
      geom instanceof MultiPoint ||
      geom instanceof GeometryCollection
    )
  ) {
    styles = [
      new Style({
        fill: style.getFill(),
        stroke,
        image: null,
        text: null,
        zIndex: style.getZIndex(),
      }),
    ];
    feature.setStyle(styles);
  }
};

/**
 * Read a KML string.
 * @param {String} kmlString A string representing a KML file.
 * @param {<ol.Projection|String>} featureProjection The projection used by the map.
 */
const readFeatures = (kmlString, featureProjection) => {
  const features = new KML().readFeatures(kmlString, {
    featureProjection,
  });
  features.forEach(feature => {
    sanitizeFeature(feature);
  });
  return features;
};

/**
 * Create a KML string.
 * @param {VectorLayer} layer a react-spatial VectorLayer.
 * @param {<ol.Projection|String>} featureProjection The current projection used by the features.
 */
const writeFeatures = (layer, featureProjection) => {
  let featString;
  const { olLayer } = layer;
  const exportFeatures = [];

  olLayer.getSource().forEachFeature(f => {
    // We silently ignore Circle elements as they are
    // not supported in kml.
    if (f.getGeometry().getType() === 'Circle') {
      return;
    }

    const clone = f.clone();
    clone.setId(f.getId());
    clone.getGeometry().setProperties(f.getGeometry().getProperties());
    clone.getGeometry().transform(featureProjection, 'EPSG:4326');

    // Extended data breaks KML validity so we remove it for now.
    for (let i = 0; i < f.getProperties(); i += 1) {
      if (/^(geometry|name|description)$/.test(i)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      clone.unset(i, true);
    }

    let styles;

    if (clone.getStyleFunction()) {
      styles = clone.getStyleFunction()(clone);
    } else if (olLayer && olLayer.getStyleFunction()) {
      styles = olLayer.getStyleFunction()(clone);
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

    const olStyle = new Style(newStyle);
    clone.setStyle(olStyle);
    exportFeatures.push(clone);
  });

  if (exportFeatures.length > 0) {
    if (exportFeatures.length === 1) {
      // force the add of a <Document> node
      exportFeatures.push(new Feature());
    }

    featString = new KML({
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
    if (layer.getName()) {
      featString = featString.replace(
        /<Document>/,
        `<Document><name>${layer.getName()}</name>`,
      );
    }
  }

  return featString;
};

export default { readFeatures, writeFeatures };
