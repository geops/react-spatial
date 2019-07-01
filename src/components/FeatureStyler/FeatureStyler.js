import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';
import { asString } from 'ol/color';
import StopEvents from '../StopEvents';
import Select from '../Select';
import Button from '../Button';

const propTypes = {
  /**
   *  The feature to modify.
   */
  feature: PropTypes.instanceOf(Feature),

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
   * CSS class for the container of the text font toggler.
   */
  classNameTextFont: PropTypes.string,

  /**
   * CSS class for the container of the list of text sizes.
   */
  classNameTextRotation: PropTypes.string,

  /**
   * CSS class of the selected values.
   */
  classNameSelected: PropTypes.string,

  /**
   * List of labels to be overwritten.
   */
  labels: PropTypes.shape({
    modifyColor: PropTypes.string,
    modifyText: PropTypes.string,
    modifyTextSize: PropTypes.string,
    modifyTextRotation: PropTypes.string,
    modifyIcon: PropTypes.string,
    modifyIconSize: PropTypes.string,
  }),

  /**
   * Boolean value to trigger popup re-render.
   */
  updateContent: PropTypes.bool,
};

const defaultProps = {
  t: l => l,
  feature: undefined,
  className: 'tm-feature-styler',
  classNameIcons: 'tm-modify-icons',
  classNameIconSize: 'tm-modify-icon-size',
  classNameColors: 'tm-modify-color',
  classNameTextColors: 'tm-modify-text-color',
  classNameTextSize: 'tm-modify-text-size',
  classNameTextFont: 'tm-modify-text-font',
  classNameTextRotation: 'tm-modify-text-rotation',
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
    { label: 'small size', value: 1, scale: 1 },
    { label: 'medium size', value: 1.5, scale: 1.5 },
    { label: 'big size', value: 2, scale: 2 },
  ],
  iconSizes: [
    { label: 'small size', value: [24, 24], scale: 0.5 },
    { label: 'medium size', value: [36, 36], scale: 0.75 },
    { label: 'big size', value: [48, 48], scale: 1 },
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
          id: 26,
          url: 'images/marker.png',
        },
      ],
    },
    {
      id: 'default2',
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
      ],
    },
  ],
  labels: {
    modifyColor: 'Modify color',
    modifyText: 'Modify text',
    modifyTextSize: 'Modify text size',
    modifyTextRotation: 'Modify text rotation',
    modifyIcon: 'Modify icon',
    modifyIconSize: 'Modify icon size',
  },
  updateContent: false,
};

const REGEX_BOLD = /bold /i;

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

  static isFontBold(font) {
    return REGEX_BOLD.test(font);
  }

  static toggleFontBold(font) {
    return FeatureStyler.isFontBold(font)
      ? font.replace(REGEX_BOLD, '')
      : `bold ${font}`;
  }

  static convertDegRotation(rotation) {
    const inDegrees = (((rotation || 0) * 180) / Math.PI).toFixed(0);
    if (inDegrees < 0) {
      return '0';
    }
    if (inDegrees > 360) {
      return '360';
    }
    return inDegrees;
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

    // Return a promise in case the image needs to be loaded.

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
    const textStyle = oldStyle.getText() ? oldStyle.getText().clone() : null;
    if (textStyle) {
      textStyle.setText(text);

      if (textSize) {
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
      }

      textStyle.setRotation(textRotation);
    }

    // Update Icon style if it existed.
    let iconStyle = oldStyle.getImage();

    const newStyle = new Style({
      fill: fillStyle,
      stroke: strokeStyle,
      text: textStyle,
      image: iconStyle,
      zIndex: oldStyle.getZIndex(),
    });

    if (iconStyle instanceof Icon && icon) {
      iconStyle = new Icon({
        src: icon.url,
        scale: iconSize.scale,
        anchor: icon.anchor,
        imgSize: icon.originalSize, // ie 11
      });

      newStyle.setImage(iconStyle);

      if (!iconStyle.getSize()) {
        return new Promise(resolve => {
          // Ensure the image is loaded before applying the style.
          iconStyle.load();
          iconStyle.getImage().addEventListener('load', () => {
            resolve(newStyle);
          });
          iconStyle.getImage().addEventListener('error', () => {
            resolve(newStyle);
          });
        });
      }
    }
    return Promise.resolve(newStyle);
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
    this.isFocusSet = false;
  }

  componentDidMount() {
    const { feature } = this.props;
    if (feature && feature.getStyleFunction()) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { feature, updateContent } = this.props;
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

      // When the popup is initially opened,
      // the current feature is the same as the previous feature.
      // Therefore, we cannot set the focus here.
      this.isFocusSet = false;
    }

    if (!this.isFocusSet && this.textareaInput) {
      this.textareaInput.focus();
      this.textareaInput.setSelectionRange(0, -1);
      // Select for ie
      document.execCommand('selectall');
      this.isFocusSet = true;
    }

    if (updateContent !== prevProps.updateContent) {
      // Force to re-render the popup state, if style change.
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
    } = this.props;
    let name;
    let iconCategory;
    let icon;
    let font;
    let iconSize;
    let textColor;
    let textSize;
    let textRotation;
    let useTextStyle = false;
    let useIconStyle = false;
    let useColorStyle = false;
    let color;
    const featStyle = FeatureStyler.getStyleAsArray(feature)[0];

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
      font = featStyle.getText().getFont();
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
      font,
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
    const { feature } = this.props;
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
    const stylePromise = FeatureStyler.updateStyleFromProperties(oldStyles[0], {
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

    stylePromise.then(newStyle => {
      // Reconstruct the initial styles array.
      feature.setStyle([newStyle]);
    });
  }

  renderColors(color, classNameColors, classNameSelected, onClick) {
    const { t, colors, labels } = this.props;
    return (
      <div className={classNameColors}>
        {labels.modifyColor ? <div>{t(labels.modifyColor)}</div> : null}
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

  renderColorStyle() {
    const { classNameColors, classNameSelected } = this.props;
    const { useColorStyle, color } = this.state;

    if (!useColorStyle) {
      return null;
    }

    return (
      <>
        {this.renderColors(
          color,
          classNameColors,
          classNameSelected,
          (e, newColor) => {
            this.setState({
              color: newColor,
            });
          },
        )}
      </>
    );
  }

  renderTextStyle() {
    const {
      useTextStyle,
      font,
      name,
      textColor,
      textSize,
      textRotation,
    } = this.state;
    const {
      textSizes,
      t,
      classNameTextSize,
      classNameTextFont,
      classNameTextRotation,
      classNameTextColors,
      classNameSelected,
      labels,
    } = this.props;

    if (!useTextStyle) {
      return null;
    }

    const isBold = FeatureStyler.isFontBold(font);

    return (
      <>
        <div>
          {labels.modifyText ? <div>{t(labels.modifyText)}</div> : null}
          <textarea
            ref={c => {
              this.textareaInput = c;
            }}
            rows="1"
            value={name}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <StopEvents observe={this.textareaInput} events={['keydown']} />
        </div>

        <div className={classNameTextFont}>
          <Button
            className={`tm-button${isBold ? ' tm-button-text-bold' : ''}`}
            onClick={() => {
              this.setState({ font: FeatureStyler.toggleFontBold(font) });
            }}
          >
            F
          </Button>
        </div>
        {this.renderColors(
          textColor,
          classNameTextColors,
          classNameSelected,
          (e, newColor) => {
            this.setState({
              textColor: newColor,
            });
          },
        )}
        <div className={classNameTextSize}>
          {labels.modifyTextSize ? <div>{t(labels.modifyTextSize)}</div> : null}
          <Select
            options={textSizes}
            value={textSize}
            onChange={(e, newSize) => {
              this.setState({ textSize: newSize });
            }}
          />
        </div>

        <div className={classNameTextRotation}>
          {labels.modifyTextRotation ? (
            <div>{t(labels.modifyTextRotation)}</div>
          ) : null}
          <input
            type="number"
            min="0"
            max="360"
            value={FeatureStyler.convertDegRotation(textRotation)}
            onChange={e => {
              this.setState({ textRotation: (e.target.value * Math.PI) / 180 });
            }}
          />
          <div>°</div>
          <input
            type="range"
            min="0"
            max="360"
            rows="1"
            value={FeatureStyler.convertDegRotation(textRotation)}
            onChange={e => {
              this.setState({ textRotation: (e.target.value * Math.PI) / 180 });
            }}
          />
        </div>
      </>
    );
  }

  renderIconStyle() {
    const { labels, iconCategories } = this.props;
    const { useIconStyle, icon, iconSize } = this.state;
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
          {labels.modifyIcon ? <div>{t(labels.modifyIcon)}</div> : null}
          {iconCategories.map(category => {
            return (
              <div key={category.id}>
                {category.icons.map(i => {
                  return (
                    <Button
                      key={i.url}
                      onClick={() => {
                        this.setState({ icon: i });
                      }}
                      style={{
                        width: iconSizes[0].value[0],
                        height: iconSizes[0].value[1],
                      }}
                      className={
                        icon && icon.url === i.url
                          ? classNameSelected
                          : undefined
                      }
                    >
                      <img
                        src={i.url}
                        alt={i.url}
                        width={iconSizes[0].value[0]}
                        height={iconSizes[0].value[1]}
                      />
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={classNameIconSize}>
          {labels.modifyIconSize ? <div>{t(labels.modifyIconSize)}</div> : null}
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
