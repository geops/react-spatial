import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Draggable from 'react-draggable';
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
   * CSS class of the dialog's children.
   */
  classNameChildren: PropTypes.string,

  /**
   * CSS class of the dialog's header.
   */
  classNameHeader: PropTypes.string,

  /**
   * CSS class of the dialog close button.
   */
  classNameCloseBt: PropTypes.string,

  /**
   * Specifies a selector to be used to prevent drag initialization.
   * Pass to 'cancel' props of sub-component 'react-draggable'.
   * https://github.com/mzabriskie/react-draggable
   * (Only available if isDraggable is true)
   */
  cancelDraggable: PropTypes.string,

  /**
   * Function triggered on closing dialog.
   */
  onClose: PropTypes.func.isRequired,

  /**
   * If set to true, allow user to drag the dialog.
   */
  isDraggable: PropTypes.bool,

  /**
   * If set to true, blocks the application, and disable dragging action.
   */
  isModal: PropTypes.bool,

  /**
   * If set to true, dialog is displayed.
   */
  isOpen: PropTypes.bool,

  /**
   * Dialog title.
   */
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /**
   * Default Dialog position (Only available if isDraggable is true).
   */
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),

  /**
   * Function triggered on drag stop (Only available if isDraggable is true).
   */
  onDragStop: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  className: 'tm-dialog-container',
  classNameChildren: undefined,
  classNameHeader: 'tm-dialog-header',
  classNameCloseBt: 'tm-button tm-dialog-close-bt',
  cancelDraggable: undefined,
  isDraggable: false,
  isModal: false,
  isOpen: false,
  title: undefined,
  position: null,
  onDragStop: () => {},
};

/**
 * This component creates a Dialog window.
 */
class Dialog extends Component {
  renderDialogTitle() {
    const {
      title,
      onClose,
      classNameHeader,
      classNameCloseBt,
      isDraggable,
    } = this.props;
    return (
      <Header
        className={`${classNameHeader} ${
          isDraggable ? 'tm-dialog-draggable' : ''
        }`}
      >
        {title}
        <Button className={classNameCloseBt} onClick={() => onClose()}>
          <MdClose focusable={false} />
        </Button>
      </Header>
    );
  }

  renderDialog() {
    const {
      className,
      classNameChildren,
      children,
      isModal,
      isOpen,
    } = this.props;
    return (
      <div
        className={isModal ? 'tm-modal' : 'tm-dialog'}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div className={className}>
          {this.renderDialogTitle()}
          <div className={classNameChildren}>{children}</div>
        </div>
      </div>
    );
  }

  render() {
    const {
      isModal,
      isOpen,
      isDraggable,
      onDragStop,
      position,
      cancelDraggable,
    } = this.props;

    if (isOpen) {
      if (!isModal && isDraggable) {
        const draggableProps = {};
        if (cancelDraggable) {
          draggableProps.cancel = cancelDraggable;
        }
        if (onDragStop) {
          draggableProps.onStop = evt => onDragStop(evt);
        }
        if (position) {
          draggableProps.position = position;
        }

        return <Draggable {...draggableProps}>{this.renderDialog()}</Draggable>;
      }
      return <>{this.renderDialog()}</>;
    }
    return null;
  }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
