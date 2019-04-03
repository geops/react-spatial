import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import Button from '../Button';

const propTypes = {
  /**
   * Title of the Kml export button.
   */
  title: PropTypes.string,

  /**
   *  Children content of the Kml export button.
   */
  children: PropTypes.element,

  /**
   * CSS class of the Kml export button.
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
  className: 'tm-kml-export',
};

/**
 * This component displays a button to export geometry as Kml.
 */
class KmlExportButton extends PureComponent {
  exportAsKml() {
    console.log('exportAsKml');
  }

  render() {
    const { title, children, tabIndex, className } = this.props;

    return (
      <Button
        className={className}
        title={title}
        tabIndex={tabIndex}
        onClick={e => this.exportAsKml(e)}
      >
        {children}
      </Button>
    );
  }
}

KmlExportButton.propTypes = propTypes;
KmlExportButton.defaultProps = defaultProps;

export default KmlExportButton;
