const cx = require('classnames');
const React = require('react');
const _ = require('lodash');
const TFAnalytics = require('@thinkful/tf-analytics');

const NotificationView = require('../../NotificationView');
const notificationStore = require('./notificationStore');
const NotificationActions = require('./NotificationActions');

class Notifications extends React.Component {
  constructor(props) {
    super();

    this.state = {
      notifications: [],
      unreadCount: 0,
      unseenCount: 0
    };

    this.onStatusChange = this.onStatusChange.bind(this);
    this._handleSeen = this._handleSeen.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);
    this._handleItemDismiss = this._handleItemDismiss.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = notificationStore.listen(this.onStatusChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStatusChange({ notifications, unreadCount, unseenCount }) {
    this.setState({
      unreadCount,
      unseenCount,
      notifications
    });
  }

  _handleItemClick(event, id) {
    const notification = _.find(this.state.notifications, { id });

    TFAnalytics.track('clicked-notification-item');

    if (notification.message_hyperlink !== undefined) {
      window.open(notification.message_hyperlink, '_blank');
    }
  }

  _handleItemDismiss(event, id) {
    NotificationActions.markRead([id]);
  }

  _handleSeen() {
    NotificationActions.markSeen(true);
  }

  render() {
    return (
      <NotificationView
        handleItemClick={this._handleItemClick}
        handleItemDismiss={this._handleItemDismiss}
        handleSeen={this._handleSeen}
        notifications={this.state.notifications}
        unseenCount={this.state.unseenCount}
      />
    );
  }
}

module.exports = Notifications;
