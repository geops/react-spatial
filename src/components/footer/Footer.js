import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Footer.scss';

const propTypes = {
  right: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

const defaultProps = {
  right: null,
};

class Footer extends PureComponent {
  render() {
    const { right } = this.props;

    return (
      <div className="tm-footer">
        {right}
      </div>
    );
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
