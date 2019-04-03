import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import Button from '../Button';

const propTypes = {
  /**
   * Title of the Feature export button.
   */
  title: PropTypes.string,

  /**
   *  Children content of the Feature export button.
   */
  children: PropTypes.element,

  /**
   * CSS class of the Feature export button.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,
};

const defaultProps = {
  tabIndex: 0,
  title: undefined,
  children: <FaCloudDownloadAlt focusable={false} />,
  className: 'tm-feature-export',
};

/**
 * This component displays a button to export geometry feature.
 */
class FeatureExportButton extends PureComponent {
  exportFeature() {
    console.log('exportFeature');
  }

  render() {
    const { title, children, tabIndex, className } = this.props;

    return (
      <Button
        className={className}
        title={title}
        tabIndex={tabIndex}
        onClick={e => this.exportFeature(e)}
      >
        {children}
      </Button>
    );
  }
}

FeatureExportButton.propTypes = propTypes;
FeatureExportButton.defaultProps = defaultProps;

export default FeatureExportButton;
