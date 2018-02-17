const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const MD5 = require('spark-md5');

const URL = 'https://www.gravatar.com/avatar';

const Gravatar = ({ className, style, email, size, ...props }) => (
  <img
    className={cx('gravatar', className)}
    src={`${URL}/${MD5.hash(email)}?d=${this.props.default}&s=${size}`}
    style={style || {}}
    {...props}
  />
);

Gravatar.propTypes = {
  email: PropTypes.string.isRequired,
  default: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object
};

Gravatar.defaultProps = {
  default: 'retro',
  email: '',
  size: 200,
  style: {}
};

module.exports = Gravatar;
