import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Fill, Stroke, Style, Icon } from 'ol/style';
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
};

const defaultProps = {
  t: l => l,
  feature: undefined,
  styleIdx: 0,
  className: 'tm-feature-style',
  classNameIcons: 'tm-modify-icons',
  classNameIconSize: 'tm-modify-icon-size',
  /* svgIcons: [
    { src: `data:image/svg+xml;utf8,${encodeURIComponent(NorthArrow)}` },
    { src: `data:image/svg+xml;utf8,${encodeURIComponent(NorthArrowCircle)}` },
  ], */
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
    { label: 'small_size', scale: 1 },
    { label: 'medium_size', scale: 1.5 },
    { label: 'big_size', scale: 2 },
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
          url: 'src/images/airport.png',
        },
        {
          id: 2,
          url: 'src/images/fuel.png',
        },
        {
          id: 26,
          url: 'src/images/marker.png',
        },
      ],
    },
  ],
};

class FeatureStyle extends PureComponent {
  // Defines a text stroke (white or black) depending on a text color
  static getTextStroke(olColor) {
    const stroke = Stroke({
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
    return colors[5];
  }

  static findColor(olColor, colors) {
    const rgb = asString(olColor.slice(0, 3));
    for (let i = 0; i < colors.length; i += 1) {
      if (rgb === asString(colors[i].fill)) {
        return colors[i];
      }
    }
    return colors[5];
  }

  // Return the icon url with the good color.
  static getIconUrl(icon, olColor) {
    // TODO
    return `/color/${olColor.toString()}/${icon.id}-24@2x.png`;
  }

  static getUrl(options) {
    const { icon } = options;
    const color = options.iconColor.fill;
    return icon.url || FeatureStyle.getIconUrl(icon, color);
  }

  // Get the current style defined by the properties object
  static updateStyleFromProperties(oldStyle, properties) {
    // Update Fill if it exists
    const { color } = properties;
    const fill = oldStyle.getFill();
    if (fill) {
      fill.setColor(color.fill.concat(fill.getColor()[3]));
    }

    // Update Stroke if it exists
    const stroke = oldStyle.getStroke();
    if (stroke) {
      stroke.setColor(color.fill.concat(stroke.getColor()[3]));
    }

    // Update text style
    let text;
    if (properties.text) {
      text = oldStyle.getText() || new Text();
      text.setText(properties.text);
      text.setScale(properties.textSize.scale);

      if (properties.font) {
        text.setFont(properties.font);
      }

      const textColor = properties.textColor.fill.concat([1]);
      const textFill = text.getFill() || new Fill();
      textFill.setColor(textColor);
      text.setFill(textFill);
      text.setStroke(FeatureStyle.getTextStroke(textColor));
    }

    // Update Icon style if it exists
    let icon = oldStyle.getImage();
    if (icon instanceof Icon && properties.icon) {
      const url = FeatureStyle.getUrl(properties);
      icon = new Icon({
        src: url,
        scale: properties.iconSize.scale,
        anchor: properties.icon.anchor,
      });
    }

    return new Style({
      fill,
      stroke,
      text,
      image: icon,
      zIndex: oldStyle.getZIndex(),
    });
  }

  constructor(props) {
    super(props);
    this.IDX = 0;
    const { iconCategories, colors, textSizes, iconSizes } = this.props;
    this.state = {
      font: 'arial',
      name: null,
      description: null,
      color: colors[0],
      iconCategory: iconCategories[0],
      icons: iconCategories[0].icons,
      icon: iconCategories[0].icons[0],
      iconColor: colors[0],
      iconSize: iconSizes[0],
      textColor: colors[0],
      textSize: textSizes[0],
      useIconStyle: false,
      useTextStyle: false,
      useColorStyle: false,
    };
  }

  componentDidMount() {
    const { feature } = this.props;
    if (feature) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { feature } = this.props;
    const { iconSize, icon } = this.state;
    if (feature && feature !== prevProps.feature) {
      this.updateContent();
    }

    if (iconSize !== prevState.iconSize || icon !== prevState.icon) {
      this.applyStyle();
    }
  }

  // Determines which elements to display in the feature's propereties
  // tab
  updateContent() {
    const {
      feature,
      iconCategories,
      colors,
      textSizes,
      iconSizes,
    } = this.props;
    let name;
    let description;
    let iconCategory;
    let icon;
    let iconSize;
    let iconColor;
    let textColor;
    let textSize;
    let useTextStyle = false;
    let useIconStyle = false;
    let useColorStyle = false;
    let color;

    if (feature) {
      const styles = feature.getStyleFunction()();
      const featStyle = styles[0];

      if (featStyle.getImage() instanceof Icon) {
        useIconStyle = true;
        useTextStyle = true;
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
        textColor = FeatureStyle.findColor(
          featStyle
            .getText()
            .getFill()
            .getColor(),
          colors,
        );
        textSize = FeatureStyle.findSize(
          featStyle.getText(),
          textSizes,
          textSizes[0],
        );
      }

      name = feature.get('name') || '';
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
      iconCategory,
    } = this.state;

    const text = useTextStyle ? name : undefined;

    // Update the style of the feature with the current style
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
    });

    /* const { feature, styleIdx } = this.props;
    const fill = new Fill({
      color: 'rgba(0,255,0,0.4)',
    });
    const stroke = new Stroke({
      color: 'rgba(0,255,0,1)',
      width: 1.25,
    });
    const style = new Style({
      image: ico
        ? new Icon({
            src: ico.src,
          })
        : new Circle({
            fill,
            stroke,
            radius: 15,
          }),
      fill,
      stroke,
    }); */

    // Set feature's properties
    feature.set('name', text);
    feature.set('description', description);
    feature.setStyle([
      ...oldStyles.splice(0, styleIdx),
      style,
      ...oldStyles.splice(styleIdx + 1),
    ]);
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
      /* <label>
        <span translate>{{'modify_icon_category_label'}}:</span>
        <select ng-model="options.iconCategory"
                ng-options="s.label | translate for s in options.iconCategories">
        </select>
      </label>
      <label ng-if="options.iconCategory.useColorOption">
        <span translate>{{'modify_color_label'}}:</span>
        <div class="ga-select-box ga-select-colors">
          <div ng-repeat="c in ::options.colors"
               ng-class="{'ga-selected': (options.iconColor == c)}"
               ng-click="options.iconColor = c">
            <div ng-style="::{'background-color': c.name}">
            </div>
          </div>
        </div>
      </label>
      <label>
        <span translate>{{'modify_icon_label'}}:</span>
        <div class="ga-select-box ga-select-icons"
             ng-class="{'ga-select-box-open': gaSelectBoxOpen}"
             ng-style="{color:options.iconColor.name}"
             ng-if="options.iconCategory.label === cat.label"
             ng-repeat="cat in options.iconCategories">
          <i tabindex=1 ng-repeat="i in ::cat.icons"
             class="fa fa-maki-{{::i.id}}"
             ng-if="cat.type === 'css'"
             ng-click="options.icon = i;$event.preventDefault();"> </i>
          <img ng-src="{{i.url}}" ng-repeat="i in ::cat.icons"
             class="fa"
             ng-click="options.icon = i;$event.preventDefault();"
             ng-if="cat.type === 'img'"
             height="options.iconSize" width="options.iconSize" ></img>
          <button class="ga-icon fa fa-caret-down"
             ng-click="gaSelectBoxOpen =! gaSelectBoxOpen"></button>
        </div>
      </label>
      */
    );
  }

  render() {
    const { feature, className } = this.props;
    if (!feature) {
      return null;
    }
    return <div className={className}>{this.renderIconStyle()}</div>;
  }
}

/*
        {svgIcons.map(ico => {
          if (ico.src) {
            return (
              <img
                onClick={() => {
                  this.applyNewStyle(ico);
                }}
                src={ico.src}
              />
            );
          }
          if (ico.reactComp) {
            return (
              <div
                key={Math.random()}
                onClick={() => {
                  this.applyNewStyle(ico);
                }}
              >
                {ico.reactComp}
              </div>
            );
          }
        })}
        */
FeatureStyle.propTypes = propTypes;
FeatureStyle.defaultProps = defaultProps;

export default FeatureStyle;
