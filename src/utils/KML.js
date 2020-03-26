import KML from 'ol/format/KML';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { Style, Text, Icon, Circle, Fill, Stroke } from 'ol/style';
import { asString } from 'ol/color';
import { kmlStyle } from './Styles';

const applyTextStyleForIcon = (olIcon, olText) => {
  const size = olIcon.getSize() || [48, 48];
  const scale = olIcon.getScale() || 1;
  const anchor = olIcon.getAnchor() || [
    (size[0] * scale) / 2,
    (size[1] * scale) / 2,
  ];
  const offset = [
    scale * (size[0] - anchor[0]) + 5,
    scale * (size[1] / 2 - anchor[1]),
  ];
  olText.setOffsetX(offset[0]);
  olText.setOffsetY(offset[1]);
  olText.setTextAlign('left');
};

const getVertexCoord = (geom, start = true, index = 0) => {
  const coords = geom.getCoordinates();
  const len = coords.length - 1;
  return start ? coords[index] : coords[len - index];
};

const getLineIcon = (feature, icon, color, start = true) => {
  const geom = feature.getGeometry();
  const coordA = getVertexCoord(geom, start, 1);
  const coordB = getVertexCoord(geom, start);
  const dx = start ? coordA[0] - coordB[0] : coordB[0] - coordA[0];
  const dy = start ? coordA[1] - coordB[1] : coordB[1] - coordA[1];
  const rotation = Math.atan2(dy, dx);

  return new Style({
    geometry: (feat) => {
      const ge = feat.getGeometry();
      return new Point(getVertexCoord(ge, start));
    },
    image: new Icon({
      src: icon.url,
      color,
      rotation: -rotation,
      rotateWithView: true,
      scale: icon.scale,
      imgSize: icon.size, // ie 11
    }),
  });
};

// Clean the uneeded feature's style and properties created by the KML parser.
const sanitizeFeature = (feature) => {
  const geom = feature.getGeometry();
  let styles = feature.getStyleFunction();

  // The use of clone is part of the scale fix line 156
  const tmpStyles = styles(feature);
  const style = (Array.isArray(tmpStyles) ? tmpStyles[0] : tmpStyles).clone();

  let stroke = style.getStroke();
  if (stroke && feature.get('lineDash')) {
    stroke.setLineDash(
      feature
        .get('lineDash')
        .split(',')
        .map((l) => parseInt(l, 10)),
    );
  }

  // The canvas draws a stroke width=1 by default if width=0, so we
  // remove the stroke style in that case.
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
        image = new Circle({
          radius: 1,
          fill: new Fill({ color: [0, 0, 0, 0] }),
          stroke: new Stroke({ color: [0, 0, 0, 0] }),
        });
      }

      // We replace empty white spaces used to keep mormal spaces before and after the name.
      let name = feature.get('name');
      if (/\u200B/g.test(name)) {
        name = name.replace(/\u200B/g, '');
        feature.set('name', name);
      }

      text = new Text({
        font: feature.get('textFont') || 'normal 16px Helvetica',
        text: feature.get('name'),
        fill: style.getText().getFill(),
        // rotation unsupported by KML, taken instead from custom field.
        rotation: feature.get('textRotation') || 0,
        stroke: style.getText().getStroke(),
        scale: style.getText().getScale(),
      });

      if (feature.get('textBackgroundFillColor')) {
        text.setBackgroundFill(
          new Fill({
            color: feature.get('textBackgroundFillColor'),
          }),
        );
      }

      if (feature.get('textPadding')) {
        text.setPadding(
          feature
            .get('textPadding')
            .split(',')
            .map((n) => parseFloat(n)),
        );
      }

      if (image instanceof Icon) {
        applyTextStyleForIcon(image, text);
      }
    }

    fill = undefined;
    stroke = undefined;

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

    // Add line's icons styles
    if (feature.get('lineStartIcon')) {
      styles.push(
        getLineIcon(
          feature,
          JSON.parse(feature.get('lineStartIcon')),
          stroke.getColor(),
        ),
      );
    }

    if (feature.get('lineEndIcon')) {
      styles.push(
        getLineIcon(
          feature,
          JSON.parse(feature.get('lineEndIcon')),
          stroke.getColor(),
          false,
        ),
      );
    }
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
  features.forEach((feature) => {
    sanitizeFeature(feature);
  });
  return features;
};

/**
 * Create a KML string.
 * @param {VectorLayer} layer A react-spatial VectorLayer.
 * @param {<ol.Projection|String>} featureProjection The current projection used by the features.
 */
const writeFeatures = (layer, featureProjection) => {
  let featString;
  const { olLayer } = layer;
  const exportFeatures = [];

  olLayer.getSource().forEachFeature((f) => {
    // We silently ignore Circle elements as they are
    // not supported in kml.
    if (f.getGeometry().getType() === 'Circle') {
      return;
    }

    const clone = f.clone();
    clone.setId(f.getId());
    clone.getGeometry().setProperties(f.getGeometry().getProperties());
    clone.getGeometry().transform(featureProjection, 'EPSG:4326');

    // We remove all ExtendedData not related to style.
    Object.keys(f.getProperties()).forEach((key) => {
      if (!/^(geometry|name|description)$/.test(key)) {
        clone.unset(key, true);
      }
    });

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

    // If we see spaces at the beginning or at the end we add a empty
    // white space at the beginning and at the end.
    if (newStyle.text && /^\s|\s$/g.test(newStyle.text.getText())) {
      newStyle.text.setText(`\u200B${newStyle.text.getText()}\u200B`);
    }

    // Set custom properties to be converted in extendedData in KML.
    if (newStyle.text && newStyle.text.getRotation()) {
      clone.set('textRotation', newStyle.text.getRotation());
    }

    if (newStyle.text && newStyle.text.getFont()) {
      clone.set('textFont', newStyle.text.getFont());
    }

    if (newStyle.text && newStyle.text.getBackgroundFill()) {
      clone.set(
        'textBackgroundFillColor',
        asString(newStyle.text.getBackgroundFill().getColor()),
      );
    }

    if (newStyle.text && newStyle.text.getPadding()) {
      clone.set('textPadding', newStyle.text.getPadding().join());
    }

    if (newStyle.stroke && newStyle.stroke.getLineDash()) {
      clone.set('lineDash', newStyle.stroke.getLineDash().join(','));
    }

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

    // In case we use line's icon .
    const extraLineStyles = styles.slice(1);
    extraLineStyles.forEach((extraLineStyle) => {
      if (
        extraLineStyle &&
        extraLineStyle.getImage() instanceof Icon &&
        extraLineStyle.getGeometry()
      ) {
        const coord = extraLineStyle.getGeometry()(f).getCoordinates();
        const startCoord = f.getGeometry().getFirstCoordinate();
        if (coord[0] === startCoord[0] && coord[1] === startCoord[1]) {
          clone.set(
            'lineStartIcon',
            JSON.stringify({
              url: extraLineStyle.getImage().getSrc(),
              scale: extraLineStyle.getImage().getScale(),
              size: extraLineStyle.getImage().getSize(),
            }),
          );
        } else {
          clone.set(
            'lineEndIcon',
            JSON.stringify({
              url: extraLineStyle.getImage().getSrc(),
              scale: extraLineStyle.getImage().getScale(),
              size: extraLineStyle.getImage().getSize(),
            }),
          );
        }
      }
    });

    const olStyle = new Style(newStyle);
    clone.setStyle(olStyle);

    if (
      !(
        clone.getGeometry() instanceof Point &&
        olStyle.getText() &&
        !olStyle.getText().getText()
      )
    ) {
      exportFeatures.push(clone);
    }
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
