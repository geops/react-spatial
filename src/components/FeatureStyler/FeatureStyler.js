import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';
import Point from 'ol/geom/Point';
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

  lineIcons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
      buttonIcon: PropTypes.string,
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
   * CSS class for the container of the list of stroke settings.
   */
  classNameStroke: PropTypes.string,

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
  classNameStroke: 'tm-modify-stroke',
  classNameSelected: 'tm-button tm-selected',
  lineIcons: [
    {
      name: 'left',
      icon: 'images/arrowLeft.png',
      buttonIcon: 'images/arrowLeftBlack.png',
    },
    {
      name: 'right',
      icon: 'images/arrowRight.png',
      buttonIcon: 'images/arrowRightBlack.png',
    },
  ],
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

  static getVertexCoord(geom, start = true, index = 0) {
    const coords = geom.getCoordinates();
    const len = coords.length - 1;
    return start ? coords[index] : coords[len - index];
  }

  static getLineIcon(geom, icon, color, start = true) {
    const coordA = FeatureStyler.getVertexCoord(geom, start, 1);
    const coordB = FeatureStyler.getVertexCoord(geom, start);
    const dx = coordA[0] - coordB[0];
    const dy = coordA[1] - coordB[1];
    const rotation = Math.atan2(dy, dx);

    return new Style({
      geometry: new Point(coordB),
      image: new Icon({
        src: icon,
        color,
        rotation: -rotation,
        rotateWithView: true,
      }),
    });
  }

  // Get the current style defined by the properties object
  static updateStyleFromProperties(oldStyle, feature, properties) {
    const {
      font,
      color,
      icon,
      iconSize,
      text,
      textColor,
      textSize,
      textRotation,
      lineStartIcon,
      lineEndIcon,
    } = properties;

    const extraStyles = [];

    // Return a promise in case the image needs to be loaded.

    // Update Fill style if it existed.
    const fillStyle = oldStyle.getFill();
    if (fillStyle && color) {
      fillStyle.setColor(color.fill.concat(fillStyle.getColor()[3]));
    }

    // Update Stroke style if it existed
    const strokeStyle = oldStyle.getStroke();

    if (strokeStyle) {
      if (color) {
        strokeStyle.setColor(color.fill.concat(strokeStyle.getColor()[3]));
      }

      const iconColor = color ? color.fill : strokeStyle.getColor();

      if (lineStartIcon) {
        extraStyles.push(
          FeatureStyler.getLineIcon(
            feature.getGeometry(),
            lineStartIcon,
            iconColor,
          ),
        );
      }

      if (lineEndIcon) {
        extraStyles.push(
          FeatureStyler.getLineIcon(
            feature.getGeometry(),
            lineEndIcon,
            iconColor,
            false,
          ),
        );
      }
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
          // We load the icon manually to be sure the size of the image's size is set asap.
          // Useful when you use a layer's styleFunction that makes some canvas operations.
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

    const styleArray = [newStyle, ...extraStyles];

    return Promise.resolve(styleArray);
  }

  static findLineIcon(styles, geom, lineIcons, start = true) {
    for (let i = 1; i < styles.length; i += 1) {
      if (styles[i].getImage() && styles[i].getImage().getSrc()) {
        for (let j = 0; j < lineIcons.length; j += 1) {
          if (styles[i].getImage().getSrc() === lineIcons[j].icon) {
            const coord = styles[i].getGeometry().getCoordinates();
            const startCoord = FeatureStyler.getVertexCoord(geom);
            const endCoord = FeatureStyler.getVertexCoord(geom, false);
            if (
              (coord[0] === startCoord[0] &&
                coord[1] === startCoord[1] &&
                start) ||
              (coord[0] === endCoord[0] && coord[1] === endCoord[1] && !start)
            ) {
              return lineIcons[j].icon;
            }
          }
        }
      }
    }
    return null;
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
      useStrokeStyle: false,
      lineStartIcon: null,
      lineEndIcon: null,
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
      lineStartIcon,
      lineEndIcon,
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
      textRotation !== prevState.textRotation ||
      lineStartIcon !== prevState.lineStartIcon ||
      lineEndIcon !== prevState.lineEndIcon
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
      lineIcons,
      iconSizes,
    } = this.props;
    const { lineStartIcon, lineEndIcon } = this.state;
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
    let useStrokeStyle = false;
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
      useStrokeStyle = true;
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

    const oldStyles = FeatureStyler.getStyleAsArray(feature);

    const newLineStartIcon =
      lineStartIcon ||
      FeatureStyler.findLineIcon(oldStyles, feature.getGeometry(), lineIcons);

    const newLineEndIcon =
      lineEndIcon ||
      FeatureStyler.findLineIcon(
        oldStyles,
        feature.getGeometry(),
        lineIcons,
        false,
      );

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
      useStrokeStyle,
      lineStartIcon: newLineStartIcon,
      lineEndIcon: newLineEndIcon,
    });
  }

  applyStyle() {
    const { feature, lineIcons } = this.props;
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
      lineStartIcon,
      lineEndIcon,
    } = this.state;

    const text = useTextStyle ? name : undefined;

    // Update the style of the feature with the current style
    const oldStyles = FeatureStyler.getStyleAsArray(feature);

    const stylePromise = FeatureStyler.updateStyleFromProperties(
      oldStyles[0],
      feature,
      {
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
        lineIcons,
        lineStartIcon,
        lineEndIcon,
      },
    );

    // Set feature's properties
    feature.set('name', text);
    feature.set('description', description);

    stylePromise.then(newStyle => {
      // Reconstruct the initial styles array.
      feature.setStyle(newStyle);
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
              className={`tm-button tm-color ${
                color === c ? classNameSelected : ''
              }`}
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

  renderStrokeStyle() {
    const {
      iconSizes,
      classNameStroke,
      classNameColors,
      classNameSelected,
      lineIcons,
    } = this.props;
    const { useStrokeStyle, color, lineStartIcon, lineEndIcon } = this.state;

    if (!useStrokeStyle) {
      return null;
    }

    return (
      <>
        <div className={classNameStroke}>
          <div>Start:</div>
          {lineIcons.map(lc => (
            <Button
              key={lc.name}
              className={`tm-button
                ${lineStartIcon === lc.icon ? classNameSelected : ''}`}
              style={{
                width: iconSizes[0].value[0],
                height: iconSizes[0].value[1],
              }}
              onClick={() =>
                this.setState({
                  lineStartIcon: lineStartIcon === lc.icon ? null : lc.icon,
                })
              }
            >
              <img src={lc.buttonIcon} alt={lc.name} />
            </Button>
          ))}
        </div>
        <div className={classNameStroke}>
          <div>End:</div>
          {lineIcons.map(lc => (
            <Button
              key={lc.name}
              className={`tm-button
                ${lineEndIcon === lc.icon ? classNameSelected : ''}`}
              style={{
                width: iconSizes[0].value[0],
                height: iconSizes[0].value[1],
              }}
              onClick={() =>
                this.setState({
                  lineEndIcon: lineEndIcon === lc.icon ? null : lc.icon,
                })
              }
            >
              <img src={lc.buttonIcon} alt={lc.name} />
            </Button>
          ))}
        </div>
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
        {this.renderStrokeStyle()}
      </div>
    );
  }
}

FeatureStyler.propTypes = propTypes;
FeatureStyler.defaultProps = defaultProps;

export default FeatureStyler;
