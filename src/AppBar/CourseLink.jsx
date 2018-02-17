const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const CourseLink = ({ arrow, href, icon, name }) => (
  <a className="app-nav-courses-link" href={href}>
    {icon && <img className="app-nav-courses-icon" src={icon} />}
    <span className="app-nav-courses-link-text">{name}</span>
    {arrow && <span className="icon-navigateright" />}
  </a>
);

CourseLink.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string,
  arrow: PropTypes.bool
};

module.exports = CourseLink;
