const PropTypes = require('prop-types');
const React = require('react');

const Icon = ({ className, name, ...props }) => (
  <span
    aria-hidden="true"
    className={`tui-icon icon-${name} ${className}`}
    {...props}
  />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

Icon.defaultProps = {
  name: 'pizza'
};

module.exports = Icon;
