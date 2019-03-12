import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  className: PropTypes.string,
  classNameContent: PropTypes.string,
  classNameTitle: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      element: PropTypes.element,
    }),
  ).isRequired,
  // react-i18next
  t: PropTypes.func.isRequired,
};
const defaultProps = {
  className: 'tm-menu',
  classNameContent: 'tm-menu-content',
  classNameTitle: 'tm-menu-item-title',
};

const Menu = ({
  className,
  classNameContent,
  classNameTitle,
  menuItems,
  t,
}) => (
  <div className={className}>
    <div className={classNameContent}>
      {menuItems.map(item => (
        <div key={item.title}>
          <div className={classNameTitle}>{t(item.title)}</div>
          {item.element}
        </div>
      ))}
    </div>
  </div>
);

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default withTranslation()(Menu);
