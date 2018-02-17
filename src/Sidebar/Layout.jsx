const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');

const SidebarLayout = ({ sidebarMenu }) => (
  <div className="sidebar-layout-container">
    <div className="sidebar-layout-sidebar">{sidebarMenu}</div>
    <div className="sidebar-layout-main">{this.props.children}</div>
  </div>
);

SidebarLayout.propTypes = {
  sidebarMenu: PropTypes.element
};

module.exports = SidebarLayout;
