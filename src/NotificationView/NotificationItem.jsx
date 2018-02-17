const cx = require('classnames');
const moment = require('moment');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');

const VotingBar = require('./VotingBar');

const NOOP = () => {};

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
    this._handleDismiss = this._handleDismiss.bind(this);
  }

  _handleClick(e) {
    this.props.onClick(e, this.props.id);
  }

  _handleDismiss(e) {
    this.props.onDismiss(e, this.props.id);
  }

  render() {
    const { time, message, votable, votable_url } = this.props;

    const timeDifference = moment.utc(time).fromNow();

    return (
      <li className="tui-notification-item">
        <a
          onClick={this._handleDismiss}
          className="tui-notification-item-dismiss"
        >
          <Icon name="close" />
        </a>
        <a onClick={this._handleClick} className="tui-notification-content">
          <time className="tui-notification-time">{timeDifference}</time>
          <p className="tui-notification-message">{message}</p>
          {votable && votable_url && <VotingBar url={votable_url} />}
        </a>
      </li>
    );
  }
}

NotificationItem.propTypes = {
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDismiss: PropTypes.func,
  time: PropTypes.string.isRequired,
  votable: PropTypes.bool,
  votable_url: PropTypes.string
};

NotificationItem.defaultProps = {
  onClick: NOOP,
  onClick: NOOP,
  votable: false,
  votable_url: ''
};

module.exports = NotificationItem;
