const cx = require('classnames');
const React = require('react');

const NOOP = () => {};

class Tag extends React.Component {

  static displayName = 'Tag'

  static propTypes = {
    className: React.PropTypes.string,
    displayName: React.PropTypes.string,
    url: React.PropTypes.string
  }

  static defaultProps = {
    onClick: NOOP
  }

  render() {
    const {children, className, displayName, onClick, url} = this.props;
    return <a
        className={cx("tui-tag", className)}
        href={url}
        onClick={onClick}>
      {displayName}
      {children}
    </a>
  }
}

module.exports = {Tag}
