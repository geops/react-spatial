import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDCDialog } from '@material/dialog';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  isModal: PropTypes.Boolean,
  isOpen: PropTypes.Boolean,
};

const defaultProps = {
  title: 'A Dialog Box',
  children: undefined,
  className: 'mdc-dialog',
  isModal: false,
  isOpen: true,
};

class Dialog extends Component {
  constructor(props) {
    super(props);

    this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
  }

  render() {
    const { title, children, className, isModal, isOpen } = this.props;
    return (
      <div
        className={className}
        title={title}
        isModal={isModal}
        isOpen={isOpen}
      >
        <h1>{title}</h1>
        {children}
      </div>
    );
  }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
