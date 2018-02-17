const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');

const SidebarMenu = ({ heading, items }) => (
  <div className="sidebar-menu">
    <div className="subheading">{heading}</div>
    {items}
  </div>
);

SidebarMenu.propTypes = {
  heading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.component)
};

SidebarMenu.defaultProps = {
  items: []
};

module.exports = SidebarMenu;
