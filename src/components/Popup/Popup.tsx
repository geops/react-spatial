import { getCenter } from "ol/extent";
import { unByKey } from "ol/Observable";
import { PureComponent } from "react";
import { MdClose } from "react-icons/md";

import type Feature from "ol/Feature";
import type OLMap from "ol/Map";
import type React from "react";

export interface PopupTitles {
  closeButton?: string;
}

export interface PopupProps {
  /**
   * React Children.
   */
  children: React.ReactNode;
  /**
   * Class name of the popup.
   */
  className?: string;
  /**
   * An [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   */
  feature?: Feature;
  /**
   * Popup title.
   */
  header?: React.ReactElement | string;
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: OLMap;
  /**
   * Function triggered on close button click.
   */
  onCloseClick?: () => void;
  /**
   * If true, the popup is panned in the map's viewport.
   */
  panIntoView?: boolean;
  /**
   * Custom BoundingClientRect to fit popup into.
   * Use if panIntoView is true. Default is the map's BoundingClientRect.
   */
  panRect?: Record<string, number>;
  /**
   * Coordinate position of the popup.
   */
  popupCoordinate?: number[];
  /**
   * Render the close button
   */
  renderCloseButton?: (props: PopupProps) => React.ReactNode;
  /**
   * Render the footer
   */
  renderFooter?: (props: PopupProps) => React.ReactNode;
  /**
   * Render the header
   */
  renderHeader?: (props: PopupProps) => React.ReactNode;
  /**
   * HTML tabIndex attribute.
   */
  tabIndex?: string;
  /**
   * Title HTML attributes.
   */
  titles?: PopupTitles;
}

interface PopupState {
  left: number;
  popupElement: HTMLDivElement | null;
  top: number;
}

const defaultProps = {
  className: "rs-popup",
  feature: null,
  header: null,
  onCloseClick: () => {},
  panIntoView: false,
  panRect: null,
  popupCoordinate: null,
  renderCloseButton: null,
  renderFooter: () => {
    return null;
  },
  renderHeader: null,
  tabIndex: "",
  titles: { closeButton: "Close" },
};

/**
 * The Popup component renders a popup over an
 * [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html)
 * on click.
 */
class Popup extends PureComponent<PopupProps, PopupState> {
  postrenderKey: any;

  constructor(props: PopupProps) {
    super(props);
    this.state = {
      left: 0,
      popupElement: null,
      top: 0,
    };
    this.postrenderKey = null;
  }

  static renderCloseButton({ onCloseClick, titles }: PopupProps) {
    return (
      <div
        aria-label={titles.closeButton}
        className="rs-popup-close-bt"
        onClick={() => {
          return onCloseClick();
        }}
        onKeyPress={(evt) => {
          return evt.which === 13 && onCloseClick();
        }}
        role="button"
        tabIndex={0}
        title={titles.closeButton}
      >
        <MdClose focusable={false} />
      </div>
    );
  }

  static renderHeader(props: PopupProps) {
    const { header, renderCloseButton } = props;
    return (
      <div className="rs-popup-header">
        {header}
        {(renderCloseButton || Popup.renderCloseButton)(props)}
      </div>
    );
  }

  componentDidMount() {
    const { map } = this.props;
    this.updatePixelPosition();

    this.postrenderKey = map.on("postrender", () => {
      this.updatePixelPosition();
    });
  }

  componentDidUpdate(prevProps: PopupProps, prevState: PopupState) {
    const { feature, panIntoView, popupCoordinate } = this.props;
    const { popupElement } = this.state;
    if (
      feature !== prevProps.feature ||
      popupCoordinate !== prevProps.popupCoordinate
    ) {
      this.updatePixelPosition();
    }

    if (
      panIntoView &&
      popupElement &&
      popupElement !== prevState.popupElement
    ) {
      this.panIntoView();
    }
  }

  componentWillUnmount() {
    unByKey(this.postrenderKey);
  }

  panIntoView() {
    const { map, panRect } = this.props;
    const { popupElement } = this.state;

    const mapRect =
      panRect || (map.getTarget() as HTMLElement).getBoundingClientRect();
    const popupRect = popupElement.getBoundingClientRect();
    const [x, y] = map.getView().getCenter();
    const res = map.getView().getResolution();
    const newCenter = [x, y];

    if (mapRect.top > popupRect.top) {
      newCenter[1] = y + (mapRect.top - popupRect.top) * res;
    }

    if (mapRect.left > popupRect.left) {
      newCenter[0] = x - (mapRect.left - popupRect.left) * res;
    }

    if (mapRect.right < popupRect.right) {
      newCenter[0] = x + (popupRect.right - mapRect.right) * res;
    }

    if (mapRect.bottom < popupRect.bottom) {
      newCenter[1] = y - (popupRect.bottom - mapRect.bottom) * res;
    }

    if (newCenter[0] !== x || newCenter[1] !== y) {
      map.getView().animate({ center: newCenter, duration: 500 });
    }
  }

  render() {
    const {
      children,
      feature,
      header,
      popupCoordinate,
      renderFooter,
      renderHeader,
      tabIndex,
      titles,
      ...other
    } = this.props as any;

    if (!feature && !popupCoordinate) {
      return null;
    }

    delete other.panIntoView;
    delete other.panRect;
    delete other.map;
    delete other.header;
    delete other.onCloseClick;
    delete other.renderCloseButton;

    const { left, top } = this.state;

    // force re-render if the feature or the coordinate changes.
    // this is needed to update the popupElement ref
    const key = feature ? feature.getId() : popupCoordinate.join();
    return (
      <div
        className="rs-popup"
        style={{
          left,
          top,
        }}
        {...other}
      >
        <div
          className="rs-popup-container"
          key={key}
          ref={(popupElement) => {
            this.setState({ popupElement });
          }}
          tabIndex={tabIndex}
        >
          {(renderHeader || Popup.renderHeader)(this.props)}
          <div className="rs-popup-body">{children}</div>
          {renderFooter(this.props)}
        </div>
      </div>
    );
  }

  updatePixelPosition() {
    const { feature, map, popupCoordinate } = this.props;
    let coord: null | number[] = popupCoordinate;

    if (feature && !coord) {
      coord = getCenter(feature.getGeometry().getExtent());
    }

    if (coord) {
      const pos = map.getPixelFromCoordinate(coord);

      if (pos?.length === 2) {
        this.setState({
          left: pos[0],
          top: pos[1],
        });
      }
    }
  }
}

(Popup as any).defaultProps = defaultProps;

export default Popup;
