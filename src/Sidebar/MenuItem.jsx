const React = require('react');
const PropTypes = require('prop-types');
const cx = require('classnames');

const Icon = require('../Icon');

const MenuItem = ({ classes, isActive, handleClick }) => (
  <div
    className={cx(classes, 'menu-item', { 'menu-item__active': isActive })}
    onClick={handleClick}
  >
    <Icon name="navigateright" />
    {this.props.children}
  </div>
);

MenuItem.propTypes = {
  classes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  isActive: PropTypes.bool
};

module.exports = MenuItem;
