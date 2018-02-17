const moment = require('moment');
const Reflux = require('reflux');
const _ = require('lodash');

const { NotificationActions, userFeed } = require('./NotificationActions');

/**
 * This store connects with GetStream and holds a bundle that contains
 * the count of unread and unseen notifications, as well as an array of
 * notification objects. The Notification Component will listen to it to
 * obtain updates in order to display accurate information.
 *
 */
const notificationStore = Reflux.createStore({
  init() {
    this.bundle = [];

    // We listen to complete pulls of the latest notifications
    this.listenTo(
      NotificationActions.fetchNotifications.completed,
      this._onFetchCompleted
    );

    // We listen to push updates
    this.listenTo(
      NotificationActions.processEvent.completed,
      this._onUpdateReceived
    );

    // Manually trigger the initial pull to fill up the store
    NotificationActions.fetchNotifications(); // This is so fetch

    // This opens a websocket with GetStream and passes a callback to the store
    // so that we can process push updates.
    if (!userFeed) return;
    userFeed
      .subscribe(NotificationActions.processEvent)
      .then(() => {}, this._onError);
  },

  _onFetchCompleted(bundle) {
    console.log('[notificationStore] Fetch completed');
    this.bundle = bundle;
    this.trigger(this.bundle);
  },

  _onUpdateReceived(update) {
    console.log('[notificationStore] Push update received');
    this.bundle = {
      unreadCount: update.unreadCount,
      unseenCount: update.unseenCount,
      // A push update contains only new and deleted notifications, so we:
      //   1. Add the new ones to the ones we had
      //   2. Filter the matching deleted ids in the local store
      //   3. Re-sort them
      notifications: _.sortBy(
        _.filter(
          _(this.bundle.notifications)
            .concat(update.added)
            .value(),
          function(item) {
            return _.findIndex(_.pluck(update.deleted, 'id'), item.id) === -1;
          }
        ),
        'time'
      ).reverse()
    };
    this.trigger(this.bundle);
  },

  _onError(error) {
    console.log(
      '[notificationStore] An error happened while processing ' +
        'notifications: ' +
        error
    );
  }
});

module.exports = notificationStore;
