const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

class Loader extends React.Component {
  render() {
    const { className, height } = this.props;

    return (
      <div className={cx('tui-loader', className)} style={{ height }}>
        <svg className="tui-loader-inner" height="25" width="25">
          <circle
            className="tui-loader-stroke"
            cx="25"
            cy="25"
            r="15"
            fill="none"
            strokeWidth="5"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    );
  }
}

Loader.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Loader.defaultProps = {
  height: 60
};

module.exports = Loader;
