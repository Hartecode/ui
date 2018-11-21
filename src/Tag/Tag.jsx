const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const NOOP = () => {};

const Tag = ({ children, className, displayName, onClick, url }) => (
  <a
    className={cx('tui-tag', className, {
      'tui-tag__disabled': !onClick && !url,
    })}
    href={url}
    onClick={() => onClick && onClick()}
  >
    {displayName}
    {children}
  </a>
);

Tag.propTypes = {
  className: PropTypes.string,
  displayName: PropTypes.string,
  url: PropTypes.string,
};

Tag.defaultProps = {
  onClick: null,
};

module.exports = Tag;
