import { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';

const propTypes = {
  /**
   * Params to be written in url.
   */
  params: PropTypes.object.isRequired,

  /**
   * Either 'react-router' history object:
   * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/history.md<br>
   * or default fallback as HTML5 History:
   * https://developer.mozilla.org/en-US/docs/Web/API/History
   */
  history: PropTypes.shape({
    replace: PropTypes.func,
  }),
};

const defaultProps = {
  history: null,
};

/**
 * This component handles permalink logic.
 */
class Permalink extends Component {
  componentDidUpdate() {
    this.updateHistory();
  }

  updateHistory() {
    const { params, history } = this.props;

    const qsStr = qs.stringify(params, { encode: false });

    const locSearch = `?${qsStr}`;

    if (
      (!qsStr && window.location.search) ||
      (qsStr && locSearch !== window.location.search)
    ) {
      if (history) {
        history.replace({
          search: locSearch === '?' ? '' : locSearch,
        });
      } else {
        const { hash } = window.location;
        window.history.replaceState(
          undefined,
          undefined,
          `${locSearch === '?' ? '' : locSearch}${hash || ''}`,
        );
      }
    }
  }

  render() {
    return null;
  }
}

Permalink.propTypes = propTypes;
Permalink.defaultProps = defaultProps;

export default Permalink;
