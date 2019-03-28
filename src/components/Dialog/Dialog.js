import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Dialog.scss';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  // className: PropTypes.string,
};

const defaultProps = {
  title: 'A Dialog Box',
  children: undefined,
  // className: 'tm-dialog',
};

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      isOpen: true,
    };
    this.openDialogHandler = this.openDialogHandler.bind(this);
    this.closeDialogHandler = this.closeDialogHandler.bind(this);
  }

  openDialogHandler() {
    this.setState(
      () => ({
        isOpen: true,
        isModal: true,
      }),
      () => {
        console.log('Dialog opened');
        console.log(this.state);
      },
    );
    const child = document.getElementById('child');
    const parent = document.getElementById('parent');
    parent.classList.add('disabled')
    child.classList.remove('disabled');
  }

  closeDialogHandler() {
    this.setState(
      () => ({
        isOpen: false,
        isModal: false,
      }),
      () => {
        console.log('Dialog closed');
        console.log(this.state);
      },
    );
    const element = document.getElementById('parent');
    element.classList.add('disabled');
  }

  render() {
    const { title, children } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <div id="parent">
          <button
            type="button"
            className="tm-dialog-btn"
            onClick={this.openDialogHandler}
          >
            Open Dialog
          </button>
          <div id="child" title={title}>
            <div
              className="modal-wrapper"
              style={{
                transform: isOpen ? 'translateY(0vh)' : 'translateY(-100vh)',
                opacity: isOpen ? '1' : '0',
              }}
            >
              <h1>{title}</h1>
              <div className="modal-body">{children}</div>
              <button
                type="button"
                className="tm-dialog-btn"
                onClick={this.closeDialogHandler}
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
