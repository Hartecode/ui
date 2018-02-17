const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const TFAnalytics = require('@thinkful/tf-analytics');

const Icon = require('../Icon');
const NotificationItem = require('./NotificationItem');

const NoNotifications = () => (
  <ul className="tui-notification-list">
    <li className="tui-notification-item">
      <div className="tui-notification-content">
        <p className="tui-notification-message">
          No new notifications. When you receive any, they'll show up here.
        </p>
      </div>
    </li>
  </ul>
);

const NotificationItemList = ({
  notifications,
  onItemClick,
  onItemDismiss
}) => (
  <ul className="tui-notification-list">
    {notifications.map((notification, idx) => (
      <NotificationItem
        key={idx}
        onClick={onItemClick}
        onDismiss={onItemDismiss}
        {...notification}
      />
    ))}
  </ul>
);

NotificationItemList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  onItemClick: PropTypes.func,
  onItemDismiss: PropTypes.func
};

class NotificationView extends React.Component {
  constructor(props) {
    super(props);

    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = { visible: false };
  }

  collapse() {
    this.setState({ visible: false });
  }

  expand() {
    this.props.handleSeen && this.props.handleSeen();
    this.setState({ visible: true });
  }

  toggle() {
    const { handleSeen, unreadCount } = this.props;
    const { visible } = this.state;

    if (unreadCount === 0) {
      return;
    }

    if (!visible) {
      TFAnalytics.track('clicked-notification-bell');
      handleSeen && handleSeen();
    }

    this.setState({ visible: !visible });
  }

  render() {
    const {
      handleItemClick,
      handleItemDismiss,
      notifications,
      unseenCount
    } = this.props;

    const containerClasses = cx('tui-notification-list-container', {
      'tui-notification-list-container__visible': this.state.visible
    });

    const countClasses = cx('tui-notification-count', {
      'tui-notification-count__clear': unseenCount === 0
    });

    const unreadNotifictaions = notifications.filter(notif => !notif.is_read);
    const hasNotifications = !_.isEmpty(unreadNotifications);

    return (
      <div className="tui-notification-view">
        <a className="tui-notification-toggle" onClick={this.toggle}>
          <span className={countClasses}>
            {unseenCount || <Icon name="notification" />}
          </span>
        </a>
        <div className={containerClasses}>
          {hasNotifications ? (
            <NotificationItemList
              notifications={unreadNotifications}
              onItemClick={handleItemClick}
              onItemDismiss={handleItemDismiss}
            />
          ) : (
            <NoNotifications />
          )}
        </div>
      </div>
    );
  }
}

NotificationView.propTypes = {
  handleItemClick: PropTypes.func,
  handleItemDismiss: PropTypes.func,
  handleSeen: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object),
  unseenCount: PropTypes.number
};

module.exports = NotificationView;
