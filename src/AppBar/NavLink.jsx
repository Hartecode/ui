const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const Icon = require('../Icon');

const NavLink = (
  { active, className, displayName, external, icon, url },
  { user },
) => {
  return (
    <a
      className={cx('tui-app-nav-link', className, { active })}
      href={url}
      target={external ? '_blank' : '_self'}
    >
      {displayName && <span className="tui-app-nav-text">{displayName}</span>}
    </a>
  );
};

NavLink.contextTypes = {
  user: PropTypes.object,
};

NavLink.propTypes = {
  active: PropTypes.bool,
  displayName: PropTypes.string,
  icon: PropTypes.string,
  url: PropTypes.string.isRequired,
};
module.exports = NavLink;
