import React from 'react';
import PropTypes from 'prop-types';
import ActionLink from '../link/ActionLink';

const propTypes = {
  /**
   * Values of links.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,

  /**
   * Returns the href attribute.
   */
  getHref: PropTypes.func,

  /**
   * Returns the label to display.
   */
  getLabel: PropTypes.func,

  /**
   * Returns the text added in title attribute.
   */
  getTitle: PropTypes.func,

  /**
   * Returns a boolean indicating whether the object is selected.
   */
  isSelected: PropTypes.func.isRequired,

  /**
   * Function triggered on link's click event.
   *
   * @param {Event} evt The click event object.
   * @param {String} val The value associated to the link clicked.

   */
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  getHref: () => '#',
  getLabel: option => option.label,
  getTitle: option => option.title,
};

/**
 * This component displays a list of a element associated to values and
 * behaves like a select element.
 */
const SelectLinks = ({
  options,
  getHref,
  getLabel,
  getTitle,
  isSelected,
  onClick,
}) => (
  <>
    {(options || []).map(option => (
      <ActionLink
        key={getLabel(option)}
        href={getHref(option)}
        title={getTitle(option)}
        tabIndex="0"
        className={isSelected(option) ? 'tm-selected' : null}
        onClick={evt => onClick(evt, option)}
      >
        {getLabel(option)}
      </ActionLink>
    ))}
  </>
);

SelectLinks.propTypes = propTypes;
SelectLinks.defaultProps = defaultProps;

export default SelectLinks;
