const Reflux = require('reflux');
const stream = require('getstream');
const _ = require('lodash');

const CONFIG = global.__env ? global.__env.config : null;
const USER = global.__env ? global.__env.user : null;

const NotificationActions = Reflux.createActions({
  fetchNotifications: { asyncResult: true },
  markSeen: { asyncResult: true },
  markRead: { asyncResult: true },
  processEvent: { asyncResult: true }
});

let client = null;
let userFeed = null;

if (CONFIG && CONFIG.vendor.getstream.userFeedToken) {
  client = stream.connect(
    CONFIG.vendor.getstream.apiKey,
    null,
    CONFIG.vendor.getstream.appId
  );
  userFeed = client.feed(
    'navbar_notifications',
    (USER ? USER.contact_id : 1).toString(),
    CONFIG.vendor.getstream.userFeedToken
  );
} else {
}

const LIMIT = 5;

const processFetch = function(refetch, error, response, body) {
  if (!response || response.status === 200) {
    let unread = body.unread;
    let unseen = body.unseen;
    let notifications = _.sortBy(
      _.merge(
        _.flatten(_.pluck(body.results, 'activities')),
        _.map(body.results, function(item) {
          return _.pick(item, ['is_seen', 'is_read', 'id']);
        })
      ),
      'time'
    ).reverse();
    /* Sample result
        actor: "Thinkful"
        foreign_id: null
        id: "9fc56050-61a1-11e5-8080-8001719413bb"
        is_read: false
        is_seen: false
        message: "Have opinions? Take our satisfaction survey!"
        object: "Core NPS survey"
        origin: null
        target: null
        time: "2015-09-23T03:17:30.280968"
        verb: "request-nps"
    */

    if (refetch) {
      NotificationActions.fetchNotifications();
    }
    this.completed({
      unreadCount: unread,
      unseenCount: unseen,
      notifications: notifications
    });
  } else {
    console.log('[NotificationActions][processFetch] Failure processing...');
    console.log(error);
    console.log(response);
    console.log(body);
    this.failed(error);
  }
};

NotificationActions.fetchNotifications.listen(function() {
  if (!userFeed) return;
  userFeed.get({ limit: LIMIT }, processFetch.bind(this, false));
});

NotificationActions.markSeen.listen(function(markSeen) {
  if (!userFeed) return;
  userFeed.get(
    { limit: LIMIT, mark_seen: markSeen },
    processFetch.bind(this, true)
  );
});

NotificationActions.markRead.listen(function(markRead) {
  if (!userFeed) return;
  userFeed.get(
    { limit: LIMIT, mark_read: markRead },
    processFetch.bind(this, true)
  );
});

NotificationActions.processEvent.listen(function(data) {
  console.log('Processing push event...', data);
  let unread = data.unread;
  let unseen = data.unseen;
  let deleted = _.sortBy(
    _.merge(
      _.flatten(_.pluck(data.deleted, 'activities')),
      _.map(data.deleted, function(item) {
        return _.pick(item, ['is_seen', 'is_read', 'id']);
      })
    ),
    'time'
  );
  let added = _.sortBy(
    _.merge(
      _.flatten(_.pluck(data.new, 'activities')),
      _.map(data.new, function(item) {
        return _.pick(item, ['is_seen', 'is_read', 'id']);
      })
    ),
    'time'
  );
  this.completed({
    unreadCount: unread,
    unseenCount: unseen,
    added: added,
    deleted: deleted
  });
});

module.exports = {
  NotificationActions,
  userFeed
};
