const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');

const NavLink = (
  { active, className, disableInOnboarding, displayName, external, icon, url },
  { user }
) => {
  const disabled =
    disableInOnboarding &&
    user &&
    user.onboarding_step &&
    user.access.indexOf('cp-onboarding') > -1;

  return (
    <a
      className={cx('app-nav-link', className, { active, disabled })}
      href={url}
      target={external ? '_blank' : '_self'}
    >
      {icon && <Icon className="app-nav-icon" name={icon} />}
      {displayName && <span className="app-nav-text">{displayName}</span>}
    </a>
  );
};

NavLink.contextTypes = {
  user: PropTypes.object
};

NavLink.propTypes = {
  active: PropTypes.bool,
  displayName: PropTypes.string,
  icon: PropTypes.string,
  url: PropTypes.string.isRequired
};

module.exports = NavLink;
