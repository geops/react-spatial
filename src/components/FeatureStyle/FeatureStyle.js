import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Fill, Stroke, Style, Icon, Text } from 'ol/style';
import { asString } from 'ol/color';
import Select from '../Select';
import Button from '../Button';

const propTypes = {
  feature: PropTypes.instanceOf(Feature),
  styleIdx: PropTypes.number,
  /* svgIcons: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.url,
      reactComp: PropTypes.element,
    }),
  ), */
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.array,
      border: PropTypes.string,
    }),
  ),
  textSizes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      scale: PropTypes.number,
    }),
  ),
  iconSizes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.array,
      scale: PropTypes.number,
    }),
  ),
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
  className: PropTypes.string,
  classNameIcons: PropTypes.string,
  classNameIconSize: PropTypes.string,
  classNameColors: PropTypes.string,
  classNameTextSize: PropTypes.string,
};

const defaultProps = {
  t: l => l,
  feature: undefined,
  styleIdx: 0,
  className: 'tm-feature-style',
  classNameIcons: 'tm-modify-icons',
  classNameIconSize: 'tm-modify-icon-size',
  classNameColors: 'tm-modify-color',
  classNameTextSize: 'tm-modify-text-size',
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
    /* {
      id: 'modify_icon_category_default_label',
      label: 'modify_icon_category_default_label',
      useColorOption: true,
      type: 'css',
      regex: getDefaultIconsRegex,
      icons: iconsCategory0,
    }, */
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

class FeatureStyle extends PureComponent {
  // Defines a text stroke (white or black) depending on a text color
  static getTextStroke(olColor) {
    const stroke = new Stroke({
      color: olColor[1] >= 160 ? [0, 0, 0, 1] : [255, 255, 255, 1],
      width: 3,
    });
    return stroke;
  }

  static findCategoryBySource(src, categories) {
    for (let i = 0; i < categories.length; i += 1) {
      const c = categories[i];
      const regex = c.type === 'img' ? new RegExp(`^(.*)${c.id}`) : c.regex();
      if (
        regex.test(src) ||
        (c.type === 'img' && c.icons.find(ico => ico.url === src))
      ) {
        return c;
      }
    }
    return null;
  }

  // Find the corresponding style
  static findIcon(olIcon, category) {
    const src = olIcon.getSrc();
    const { icons } = category;
    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      const regex =
        category.type === 'img'
          ? new RegExp(`${category.id}-${icon.id}.png`)
          : category.regex(icon.id);
      if (regex.test(src) || (category.type === 'img' && icon.url === src)) {
        return icons[i];
      }
    }
    return null;
  }

  static findSize(olStyle, sizes, dflt) {
    const scale = olStyle.getScale();
    for (let i = 0; i < sizes.length; i += 1) {
      if (scale === sizes[i].scale) {
        return sizes[i];
      }
    }
    return dflt || sizes[2];
  }

  static findIconColor(olIcon, colors) {
    const url = olIcon.getSrc();
    // Test if the url use the color service
    const colorReg = /\/([0-9]{1,3},[0-9]{1,3},[0-9]{1,3})\//;
    const rgb = url.match(colorReg);
    if (rgb) {
      for (let i = 0; i < colors.length; i += 1) {
        if (colors[i].fill.toString() === rgb[1].toString()) {
          return colors[i];
        }
      }
    }
    // Red
    return null;
  }

  static findColor(olColor, colors) {
    const rgb = asString(
      typeof olColor === 'string' ? olColor : olColor.slice(0, 3),
    );
    for (let i = 0; i < colors.length; i += 1) {
      if (rgb === asString(colors[i].fill)) {
        return colors[i];
      }
    }
    return null;
  }

  // Return the icon url with the good color.
  static getIconUrl(icon, olColor) {
    // TODO
    return `/color/${olColor.toString()}/${icon.id}-24@2x.png`;
  }

  static getUrl(icon, iconColor) {
    return (
      icon.url || (iconColor && FeatureStyle.getIconUrl(icon, iconColor.fill))
    );
  }

  // Get the current style defined by the properties object
  static updateStyleFromProperties(oldStyle, properties) {
    // Update Fill if it exists
    const {
      font,
      color,
      icon,
      iconColor,
      iconSize,
      text,
      textColor,
      textSize,
      textRotation,
    } = properties;

    // Update Fill style if it existed.
    const fillStyle = oldStyle.getFill();
    if (fillStyle) {
      fillStyle.setColor(color.fill.concat(fillStyle.getColor()[3]));
    }

    // Update Stroke style if it existed
    const strokeStyle = oldStyle.getStroke();
    if (strokeStyle) {
      strokeStyle.setColor(color.fill.concat(strokeStyle.getColor()[3]));
    }

    // Update Text style if it existed;
    let textStyle = oldStyle.getText();
    if (textStyle) {
      textStyle = oldStyle.getText() || new Text();
      textStyle.setText(text);

      if (textSize && textSize.scale !== 1) {
        textStyle.setScale(textSize.scale);
      }

      if (font) {
        // textStyle.setFont(font);
      }

      if (textColor) {
        const olColor = textColor.fill.concat([1]);
        const textFill = textStyle.getFill() || new Fill();
        textFill.setColor(olColor);
        textStyle.setFill(textFill);
        textStyle.setStroke(FeatureStyle.getTextStroke(olColor));
      }

      if (textRotation > 0) {
        textStyle.setRotation(textRotation);
      }
    }

    // Update Icon style if it existed.
    let iconStyle = oldStyle.getImage();
    if (iconStyle instanceof Icon && icon) {
      const url = FeatureStyle.getUrl(icon, iconColor);
      iconStyle = new Icon({
        src: url,
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
      font: 'arial',
      name: null,
      description: null,
      color: colors[0],
      iconCategory: iconCategories[0],
      icon: iconCategories[0].icons[0],
      iconColor: colors[0],
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
    if (feature && feature.getStyle()) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { feature } = this.props;
    const {
      font,
      name,
      description,
      icon,
      iconColor,
      iconCategory,
      iconSize,
      textColor,
      textSize,
      textRotation,
    } = this.state;

    // Update the content of the feature style component.
    if (feature && feature !== prevProps.feature && feature.getStyle()) {
      this.updateContent();
    }

    // Update the feature's style.
    if (
      font !== prevState.font ||
      name !== prevState.name ||
      description !== prevState.description ||
      icon !== prevState.icon ||
      iconColor !== prevState.iconColor ||
      iconCategory !== prevState.iconCategory ||
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
    let description;
    let iconCategory;
    let icon;
    let iconSize;
    let iconColor;
    let textColor;
    let textSize;
    let textRotation;
    let useTextStyle = false;
    let useIconStyle = false;
    let useColorStyle = false;
    let color;

    if (feature) {
      const styles =
        (feature.getStyleFunction() && feature.getStyleFunction()()) || [];
      let featStyle = styles[styleIdx];

      if (!featStyle) {
        if (/Point/.test(feature.getGeometry().getType())) {
          featStyle = new Style({
            image: new Icon({
              src: 'images/marker.png',
            }),
          });
        }
        if (!featStyle) {
          return;
        }
      }

      if (featStyle.getImage() instanceof Icon) {
        useIconStyle = true;
        const img = featStyle.getImage();
        iconCategory = FeatureStyle.findCategoryBySource(
          img.getSrc(),
          iconCategories,
        );
        if (iconCategory) {
          icon =
            FeatureStyle.findIcon(img, iconCategory) ||
            iconCategories[0].icons[0];
        } else {
          [iconCategory] = iconCategories;
        }
        iconSize = FeatureStyle.findSize(img, iconSizes);
        iconColor = FeatureStyle.findIconColor(img, colors);
      }

      if (!useIconStyle && featStyle.getStroke()) {
        useColorStyle = true;
        color = FeatureStyle.findColor(
          featStyle.getStroke().getColor(),
          colors,
        );
      }

      if (featStyle.getText()) {
        useTextStyle = true;
        name = featStyle.getText().getText();
        const currColor = featStyle
          .getText()
          .getFill()
          .getColor();

        if (currColor) {
          textColor = FeatureStyle.findColor(currColor, colors);
        }
        textSize = FeatureStyle.findSize(
          featStyle.getText(),
          textSizes,
          textSizes[0],
        );
        textRotation = featStyle.getText().getRotation();
      }

      name = name || feature.get('name') || '';
      description = feature.get('description') || '';
    } else {
      name = '';
      description = '';
    }

    this.setState({
      name,
      description,
      color,
      iconCategory,
      icon,
      iconSize,
      iconColor,
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
      iconColor,
      iconSize,
      textColor,
      textSize,
      textRotation,
      iconCategory,
    } = this.state;

    const text = useTextStyle ? name : undefined;

    // Update the style of the feature with the current style
    // At this point the select style has been added so the getStyle() returns an array.
    const oldStyles = feature.getStyle();
    const style = FeatureStyle.updateStyleFromProperties(oldStyles[styleIdx], {
      font,
      description,
      color,
      icon,
      iconCategory,
      iconColor,
      iconSize,
      text,
      textColor,
      textSize,
      textRotation,
    });

    // Set feature's properties
    feature.set('name', text);
    feature.set('description', description);
    feature.setStyle([
      ...oldStyles.splice(0, styleIdx),
      style,
      ...oldStyles.splice(styleIdx + 1),
    ]);
  }

  renderColors(color, onClick) {
    const { font } = this.state;
    const { t, colors, classNameColors } = this.props;
    return (
      <div className={classNameColors}>
        <div>{`${t('Modify color')}:`}</div>
        <div>
          {colors.map(c => (
            <Button
              key={c.label}
              className={color === c ? 'tm-selected' : undefined}
              onClick={e => {
                onClick(e, c);
              }}
            >
              <div
                style={{
                  color: `rgb(${c.fill.toString()})`,
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
        {this.renderColors(textColor, (e, newColor) => {
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
    const { iconSizes, t, classNameIcons, classNameIconSize } = this.props;

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
                    icon && icon.url === i.url ? 'tm-selected' : undefined
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
      </div>
    );
  }
}

FeatureStyle.propTypes = propTypes;
FeatureStyle.defaultProps = defaultProps;

export default FeatureStyle;
