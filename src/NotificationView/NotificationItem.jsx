const cx = require('classnames');
const moment = require('moment');
const React = require('react');
const {Icon} = require('../Icon');

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleDismiss = this._handleDismiss.bind(this);
  }

  _handleClick(e) {
    this.props.handleClick && this.props.handleClick(e, this.props.id);
  }

  _handleDismiss(e) {
    this.props.handleDismiss && this.props.handleDismiss(e, this.props.id);
  }

  renderVotingBar() {
    return (<div className="tui-notification-voting-bar">
      {[5,4,3,2,1].map((num) => {
        return <a key={num} className="tui-voting-star" href={this.props.votable_url + num.toString()}>
          <svg width="30px" height="30px" viewBox="0 0 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#6599FF" strokeWidth="2" fill="#FFFFFF" fillrule="evenodd">
                <path d="M2.78,12.18 L11.71,12.18 L15,3.25 L18.29,12.18 L27.22,12.18 L20.4999993,17.8604765 L23.46,26.75 L15.0000003,21 L6.54,26.75 L9.49999979,17.8604765 L2.78,12.18 Z"></path>
            </g>
          </svg>
        </a>
      })}
    </div>);
  }

  render() {
    const timeDifference = moment.utc(this.props.time).fromNow();
    const debugThis = false;

    return (<li className="tui-notification-item">
      <a onClick={this._handleDismiss} className="tui-notification-item-dismiss">
        <Icon name="close" />
      </a>
      <a onClick={this._handleClick} className="tui-notification-content">
        <time className="tui-notification-time">{timeDifference}</time>
        {debugThis && <pre>{JSON.stringify(this.props)}</pre>}
        <p className="tui-notification-message">{this.props.message}</p>
      </a>
      {this.props.votable && this.props.votable_url && this.renderVotingBar()}
    </li>);
  }
}

module.exports = {NotificationItem};
