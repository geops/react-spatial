import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Stroke, Style, Icon } from 'ol/style';
import { asString } from 'ol/color';
import Select from '../Select';
import Button from '../Button';

const propTypes = {
  /**
   *  The feature to modify.
   */
  feature: PropTypes.instanceOf(Feature),

  /**
   * Index of the style to modify.
   * Only necessary feature.getStyleFunction() returns an array of styles.
   */
  styleIdx: PropTypes.number,

  /**
   * List of colors available for modifcation.
   */
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.array,
      border: PropTypes.string,
    }),
  ),

  /**
   * List of sizes available for text modification.
   */
  textSizes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      scale: PropTypes.number,
    }),
  ),

  /**
   * List of sizes available for icon modification.
   */
  iconSizes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.array,
      scale: PropTypes.number,
    }),
  ),

  /**
   * List of categories of icons available for modification.
   */
  iconCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      useColorOption: PropTypes.bool,
      type: PropTypes.oneOf(['css', 'img']),
      regex: PropTypes.regex,
      icons: PropTypes.array,
    }),
  ),

  /** Translation function */
  t: PropTypes.func,

  /**
   * CSS class for the container.
   */
  className: PropTypes.string,

  /**
   * CSS class for the container of the list of icons.
   */
  classNameIcons: PropTypes.string,

  /**
   * CSS class for the container of the list of icon sizes.
   */
  classNameIconSize: PropTypes.string,

  /**
   * CSS class for the container of the list of colors.
   */
  classNameColors: PropTypes.string,

  /**
   * CSS class for the container of the list of text colors.
   */
  classNameTextColors: PropTypes.string,

  /**
   * CSS class for the container of the list of text sizes.
   */
  classNameTextSize: PropTypes.string,

  /**
   * CSS class of the selected values.
   */
  classNameSelected: PropTypes.string,
};

const defaultProps = {
  t: l => l,
  feature: undefined,
  styleIdx: 0,
  className: 'tm-feature-style',
  classNameIcons: 'tm-modify-icons',
  classNameIconSize: 'tm-modify-icon-size',
  classNameColors: 'tm-modify-color',
  classNameTextColors: 'tm-modify-text-color',
  classNameTextSize: 'tm-modify-text-size',
  classNameSelected: 'tm-button tm-selected',
  colors: [
    { name: 'black', fill: [0, 0, 0], border: 'white' },
    { name: 'blue', fill: [0, 0, 255], border: 'white' },
    { name: 'gray', fill: [128, 128, 128], border: 'white' },
    { name: 'green', fill: [0, 128, 0], border: 'white' },
    { name: 'orange', fill: [255, 165, 0], border: 'black' },
    { name: 'red', fill: [255, 0, 0], border: 'white' },
    { name: 'white', fill: [255, 255, 255], border: 'black' },
    { name: 'yellow', fill: [255, 255, 0], border: 'black' },
  ],
  textSizes: [
    { label: 'small_size', value: 1, scale: 1 },
    { label: 'medium_size', value: 1.5, scale: 1.5 },
    { label: 'big_size', value: 2, scale: 2 },
  ],
  iconSizes: [
    { label: 'small_size', value: [24, 24], scale: 0.5 },
    { label: 'medium_size', value: [36, 36], scale: 0.75 },
    { label: 'big_size', value: [48, 48], scale: 1 },
  ],
  // type: Type of icon: if stored as css style -> "css", if image ->"img"
  // regex: pattern for icon category. Mandatory for category type "css".
  //    It must represent the pattern after icon name and start with ^(.*)
  iconCategories: [
    {
      id: 'default',
      useColorOption: false,
      nbIcons: 160,
      type: 'img',
      icons: [
        {
          id: 1,
          url: 'images/airport.png',
        },
        {
          id: 2,
          url: 'images/fuel.png',
        },
        {
          id: 26,
          url: 'images/marker.png',
        },
      ],
    },
  ],
};

/**
 * This component allows to modify an ol.style.Style of a ol.Feature.
 * Only requirement, the feature.getStyleFunction() must return a ol.style.Style or an array of ol.style.Style.
 */
class FeatureStyler extends PureComponent {
  // Get the current style of a feature and returns an array.
  static getStyleAsArray(feature) {
    const styles = feature.getStyleFunction()();
    return Array.isArray(styles) ? styles : [styles];
  }

  // Defines a text stroke (white or black) depending on a text color
  static getTextStroke(olColor) {
    return new Stroke({
      color: olColor[1] >= 160 ? [0, 0, 0, 1] : [255, 255, 255, 1],
      width: 3,
    });
  }

  static findCategoryBySource(olIcon, categories) {
    return categories.find(c => FeatureStyler.findIcon(olIcon, c));
  }

  // Search for the current icon in a category's icons list.
  static findIcon(olIcon, category) {
    const src = olIcon.getSrc();
    return category.icons.find(icon => {
      const regex =
        category.type === 'img'
          ? new RegExp(`${category.id}-${icon.id}.png`)
          : category.regex(icon.id);
      return regex.test(src) || (category.type === 'img' && icon.url === src);
    });
  }

  // Search for the current size in a sizes list.
  static findSize(olStyle, sizes, dflt) {
    const scale = olStyle.getScale();
    return sizes.find(size => scale === size.scale) || dflt || sizes[2];
  }

  // Search for the current color in a color list.
  static findColor(olColor, colors) {
    const rgb = asString(
      typeof olColor === 'string' ? olColor : olColor.slice(0, 3),
    );
    return colors.find(c => rgb === asString(c.fill));
  }

  // Get the current style defined by the properties object
  static updateStyleFromProperties(oldStyle, properties) {
    const {
      font,
      color,
      icon,
      iconSize,
      text,
      textColor,
      textSize,
      textRotation,
    } = properties;

    // Update Fill style if it existed.
    const fillStyle = oldStyle.getFill();
    if (fillStyle && color) {
      fillStyle.setColor(color.fill.concat(fillStyle.getColor()[3]));
    }

    // Update Stroke style if it existed
    const strokeStyle = oldStyle.getStroke();
    if (strokeStyle && color) {
      strokeStyle.setColor(color.fill.concat(strokeStyle.getColor()[3]));
    }

    // Update Text style if it existed;
    const textStyle = oldStyle.getText();
    if (textStyle) {
      textStyle.setText(text);

      if (textSize && textSize.scale !== 1) {
        textStyle.setScale(textSize.scale);
      }

      if (font) {
        textStyle.setFont(font);
      }

      if (textColor) {
        const olColor = textColor.fill.concat([1]);
        const textFill = textStyle.getFill();
        textFill.setColor(olColor);
        textStyle.setFill(textFill);
        textStyle.setStroke(FeatureStyler.getTextStroke(olColor));
      }

      if (textRotation > 0) {
        textStyle.setRotation(textRotation);
      }
    }

    // Update Icon style if it existed.
    let iconStyle = oldStyle.getImage();
    if (iconStyle instanceof Icon && icon) {
      iconStyle = new Icon({
        src: icon.url,
        scale: iconSize.scale,
        anchor: icon.anchor,
      });
    }

    return new Style({
      fill: fillStyle,
      stroke: strokeStyle,
      text: textStyle,
      image: iconStyle,
      zIndex: oldStyle.getZIndex(),
    });
  }

  constructor(props) {
    super(props);
    const { iconCategories, colors, textSizes, iconSizes } = this.props;
    this.state = {
      font: '14px  Arial, serif',
      name: null,
      description: null,
      color: colors[0],
      iconCategory: iconCategories[0],
      icon: iconCategories[0].icons[0],
      iconSize: iconSizes[0],
      textColor: colors[0],
      textSize: textSizes[0],
      textRotation: 0,
      useIconStyle: false,
      useTextStyle: false,
      useColorStyle: false,
    };
  }

  componentDidMount() {
    const { feature } = this.props;
    if (feature && feature.getStyleFunction()) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { feature } = this.props;
    const {
      font,
      name,
      description,
      color,
      icon,
      iconSize,
      textColor,
      textSize,
      textRotation,
    } = this.state;

    // Update the content of the feature style component.
    if (
      feature &&
      feature.getStyleFunction() &&
      feature !== prevProps.feature
    ) {
      this.updateContent();
    }

    // Update the feature's style.
    if (
      font !== prevState.font ||
      name !== prevState.name ||
      description !== prevState.description ||
      color !== prevState.color ||
      icon !== prevState.icon ||
      iconSize !== prevState.iconSize ||
      textColor !== prevState.textColor ||
      textSize !== prevState.textSize ||
      textRotation !== prevState.textRotation
    ) {
      this.applyStyle();
    }
  }

  // Determines which elements to display in the render method.
  updateContent() {
    const {
      feature,
      iconCategories,
      colors,
      textSizes,
      iconSizes,
      styleIdx,
    } = this.props;
    let name;
    let iconCategory;
    let icon;
    let iconSize;
    let textColor;
    let textSize;
    let textRotation;
    let useTextStyle = false;
    let useIconStyle = false;
    let useColorStyle = false;
    let color;
    const featStyle = FeatureStyler.getStyleAsArray(feature)[styleIdx];

    if (!featStyle) {
      return;
    }

    if (featStyle.getImage() instanceof Icon) {
      useIconStyle = true;
      const img = featStyle.getImage();
      iconCategory = FeatureStyler.findCategoryBySource(img, iconCategories);
      if (iconCategory) {
        icon = FeatureStyler.findIcon(img, iconCategory);
      } else {
        [iconCategory] = iconCategories;
      }
      iconSize = FeatureStyler.findSize(img, iconSizes);
    }

    if (!useIconStyle && featStyle.getStroke()) {
      useColorStyle = true;
      color = FeatureStyler.findColor(featStyle.getStroke().getColor(), colors);
    }

    if (featStyle.getText()) {
      useTextStyle = true;
      name = featStyle.getText().getText();
      const currColor = featStyle
        .getText()
        .getFill()
        .getColor();
      textColor = FeatureStyler.findColor(currColor, colors);
      textSize = FeatureStyler.findSize(
        featStyle.getText(),
        textSizes,
        textSizes[0],
      );
      textRotation = featStyle.getText().getRotation();
    }

    this.setState({
      name: name || feature.get('name') || '',
      description: feature.get('description') || '',
      color,
      iconCategory,
      icon,
      iconSize,
      textColor,
      textSize,
      textRotation,
      useTextStyle,
      useIconStyle,
      useColorStyle,
    });
  }

  applyStyle() {
    const { feature, styleIdx } = this.props;
    const {
      useTextStyle,
      font,
      name,
      description,
      color,
      icon,
      iconSize,
      textColor,
      textSize,
      textRotation,
      iconCategory,
    } = this.state;

    const text = useTextStyle ? name : undefined;

    // Update the style of the feature with the current style
    const oldStyles = FeatureStyler.getStyleAsArray(feature);
    const style = FeatureStyler.updateStyleFromProperties(oldStyles[styleIdx], {
      font,
      description,
      color,
      icon,
      iconCategory,
      iconSize,
      text,
      textColor,
      textSize,
      textRotation,
    });

    // Set feature's properties
    feature.set('name', text);
    feature.set('description', description);

    // Reconstruct the initial styles array.
    feature.setStyle([
      ...oldStyles.splice(0, styleIdx),
      style,
      ...oldStyles.splice(styleIdx + 1),
    ]);
  }

  renderColors(color, onClick) {
    const { t, colors, classNameColors, classNameSelected } = this.props;
    return (
      <div className={classNameColors}>
        <div>{`${t('Modify color')}:`}</div>
        <div>
          {colors.map(c => (
            <Button
              key={c.name}
              className={color === c ? classNameSelected : undefined}
              onClick={e => {
                onClick(e, c);
              }}
            >
              <div
                style={{
                  backgroundColor: `rgb(${c.fill})`,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  renderTextColors(color, onClick) {
    const { font } = this.state;
    const { t, colors, classNameTextColors, classNameSelected } = this.props;
    return (
      <div className={classNameTextColors}>
        <div>{`${t('Modify color')}:`}</div>
        <div>
          {colors.map(c => (
            <Button
              key={c.name}
              className={color === c ? classNameSelected : undefined}
              onClick={e => {
                onClick(e, c);
              }}
            >
              <div
                style={{
                  color: `rgb(${c.fill})`,
                  font,
                  textShadow:
                    `-1px -1px 0 ${c.border},` +
                    `1px -1px 0 ${c.border},` +
                    `-1px 1px 0 ${c.border},` +
                    `1px 1px 0 ${c.border}`,
                }}
              >
                Aa
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  renderColorStyle() {
    const { useColorStyle, color } = this.state;

    if (!useColorStyle) {
      return null;
    }

    return (
      <>
        {this.renderColors(color, (e, newColor) => {
          this.setState({
            color: newColor,
          });
        })}
      </>
    );
  }

  renderTextStyle() {
    const {
      useTextStyle,
      name,
      textColor,
      textSize,
      textRotation,
    } = this.state;
    const { textSizes, t, classNameTextSize } = this.props;

    if (!useTextStyle) {
      return null;
    }

    return (
      <>
        <div>
          <div>{`${t('Modify text')}:`}</div>
          <textarea
            rows="1"
            value={name}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
        </div>
        {this.renderTextColors(textColor, (e, newColor) => {
          this.setState({
            textColor: newColor,
          });
        })}
        <div className={classNameTextSize}>
          <div>{`${t('Modify text size')}:`}</div>
          <Select
            options={textSizes}
            value={textSize}
            onChange={(e, newSize) => {
              this.setState({ textSize: newSize });
            }}
          />
        </div>

        <div>
          <div>{`${t('Modify text rotation')}:`}</div>
          <input
            type="range"
            min="0"
            max="360"
            rows="1"
            value={((textRotation || 0) * 180) / Math.PI}
            onChange={e => {
              this.setState({ textRotation: (e.target.value * Math.PI) / 180 });
            }}
          />
        </div>
      </>
    );
  }

  renderIconStyle() {
    const { useIconStyle, icon, iconSize, iconCategory } = this.state;
    const {
      iconSizes,
      t,
      classNameIcons,
      classNameIconSize,
      classNameSelected,
    } = this.props;

    if (!useIconStyle) {
      return null;
    }

    return (
      <>
        <div className={classNameIcons}>
          <div>{`${t('Modify icon')}:`}</div>
          <div>
            {iconCategory.icons.map(i => {
              return (
                <Button
                  key={i.url}
                  onClick={() => {
                    this.setState({ icon: i });
                  }}
                  style={{
                    width: iconSize.value[0],
                    height: iconSize.value[1],
                  }}
                  className={
                    icon && icon.url === i.url ? classNameSelected : undefined
                  }
                >
                  <img
                    src={i.url}
                    alt={i.url}
                    width={iconSize.value[0]}
                    height={iconSize.value[1]}
                  />
                </Button>
              );
            })}
          </div>
        </div>

        <div className={classNameIconSize}>
          <div>{`${t('Modify icon size')}:`}</div>
          <Select
            options={iconSizes}
            value={iconSize}
            onChange={(e, newIconSize) => {
              this.setState({ iconSize: newIconSize });
            }}
          />
        </div>
      </>
    );
  }

  render() {
    const { feature, className } = this.props;
    if (!feature || !feature.getStyleFunction()) {
      return null;
    }
    return (
      <div className={className}>
        {this.renderTextStyle()}
        {this.renderIconStyle()}
        {this.renderColorStyle()}
      </div>
    );
  }
}

FeatureStyler.propTypes = propTypes;
FeatureStyler.defaultProps = defaultProps;

export default FeatureStyler;
