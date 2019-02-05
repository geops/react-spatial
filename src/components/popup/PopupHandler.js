import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Feature from 'ol/Feature';
import OLMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';

import Popup from './Popup';

const propTypes = {
  className: PropTypes.string,
  ContentComponent: PropTypes.func.isRequired,
  feature: PropTypes.instanceOf(Feature),
  map: PropTypes.instanceOf(OLMap).isRequired,
  onCloseClick: PropTypes.func,
  showCloseButton: PropTypes.bool,
  store: PropTypes.shape(),
};

const defaultProps = {
  className: '',
  feature: undefined,
  onCloseClick: () => {},
  showCloseButton: true,
  store: null,
};

class PopupHandler extends Component {
  static convertToClick(e) {
    const evt = new MouseEvent('click', { bubbles: true });
    evt.stopPropagation = () => {};
    e.target.dispatchEvent(evt);
  }

  constructor(props) {
    super(props);
    this.overlay = new Overlay({ stopEvent: true });
    this.showPopup(props.feature);
  }

  componentDidUpdate(prevProps) {
    const { feature } = this.props;
    if (feature !== prevProps.feature) {
      this.showPopup(feature);
    }
  }

  onCloseClick() {
    const { onCloseClick } = this.props;
    onCloseClick();
    this.closePopup();
  }

  closePopup() {
    if (this.popupElement) {
      ReactDOM.unmountComponentAtNode(this.popupElement);
    }
  }

  showPopup(feature) {
    const {
      map,
      className,
      ContentComponent,
      showCloseButton,
      store,
    } = this.props;

    map.removeOverlay(this.overlay);
    this.closePopup();

    if (feature) {
      this.popupElement = document.createElement('div');
      const ext = feature.getGeometry().getExtent();
      this.overlay.setPosition(getCenter(ext));
      this.overlay.setElement(this.popupElement);
      map.addOverlay(this.overlay);

      ReactDOM.render(
        <Popup
          feature={feature}
          ref={this.popupComponentRef}
          className={className}
          ContentComponent={ContentComponent}
          onCloseClick={() => this.onCloseClick()}
          onMouseUp={e => PopupHandler.convertToClick(e)}
          showCloseButton={showCloseButton}
          store={store}
        />,
        this.popupElement,
      );
    }
  }

  render() {
    return null;
  }
}

PopupHandler.propTypes = propTypes;
PopupHandler.defaultProps = defaultProps;

export default PopupHandler;
