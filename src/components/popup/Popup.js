import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import Feature from 'ol/Feature';
import StopEvents from '../stopevents/StopEvents';
import Button from '../button/Button';


import './Popup.scss';

const propTypes = {
  className: PropTypes.string,
  ContentComponent: PropTypes.func.isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
  onCloseClick: PropTypes.func.isRequired,
  showCloseButton: PropTypes.bool.isRequired,
  store: PropTypes.shape(),

  t: PropTypes.func,
};

const defaultProps = {
  className: '',
  store: null,
  t: p => (p),
};

class Popup extends PureComponent {
  render() {
    const {
      t,
      className,
      ContentComponent,
      feature,
      showCloseButton,
      store,
      onCloseClick,
    } = this.props;
    let closeButton = null;

    if (showCloseButton) {
      closeButton = (
        <Button
          className="tm-popup-close-button"
          title={`Popup ${t('Schliessen')}`}
          onClick={() => onCloseClick()}
        >
          <MdClose focusable={false} />
        </Button>
      );
    }

    return (
      <div
        className={`tm-popup ${className}`}
        role="button"
        tabIndex={className === 'tm-tooltip' ? '0' : ''}
      >
        <StopEvents observe={this} events={['pointerdown', 'pointermove']} />
        { closeButton }
        <ContentComponent store={store} feature={feature} />
      </div>
    );
  }
}

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;

export default Popup;
