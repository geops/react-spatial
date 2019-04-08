import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Header from '../Header';
import Button from '../Button';

const propTypes = {
  /**
   * Children content of the Dialog.
   */
  children: PropTypes.element,

  /**
   * CSS class of the dialog.
   */
  className: PropTypes.string,

  /**
   * CSS class of the dialog close button.
   */
  classNameCloseBt: PropTypes.string,

  /**
   * Function triggered on closing dialog.
   */
  onClose: PropTypes.func.isRequired,

  /**
   * If set to true, blocks the application.
   */
  isModal: PropTypes.bool,

  /**
   * If set to true, dialog is displayed.
   */
  isOpen: PropTypes.bool,

  /**
   * Dialog title.
   */
  title: PropTypes.element,
};

const defaultProps = {
  children: undefined,
  className: '',
  classNameCloseBt: 'tm-button tm-dialog-close-bt',
  isModal: false,
  isOpen: false,
  title: undefined,
};

/**
 * This component creates a Dialog window.
 */
class Dialog extends Component {
  renderDialogTitle() {
    const { title, onClose, classNameCloseBt } = this.props;
    return (
      <Header className="tm-dialog-header">
        {title}
        <Button className={classNameCloseBt} onClick={() => onClose()}>
          <MdClose focusable={false} />
        </Button>
      </Header>
    );
  }

  render() {
    const { className, children, isModal, isOpen } = this.props;
    if (isOpen) {
      return (
        <div
          className={isModal ? 'tm-modal' : null}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div
            className={`${className} ${
              isModal ? 'tm-dialog-modal' : 'tm-dialog'
            }`}
          >
            {this.renderDialogTitle()}
            {children}
          </div>
        </div>
      );
    }
    return null;
  }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
