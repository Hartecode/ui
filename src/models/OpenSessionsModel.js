const _ = require('lodash');
const moment = require('moment-timezone');

function OpenSession(properties) {
  _.assign(this, properties);
  this.duration_minutes = properties.duration_minutes || 60;
}

OpenSession.create = function(properties) {
  return new OpenSession(properties);
};

OpenSession.prototype.startDtLocal = function(user) {
  user = user || global.__env.user || {};
  return user.timezone
    ? moment.tz(this.start_dt_utc, user.timezone)
    : moment(this.start_dt_utc);
};

OpenSession.prototype.endDtLocal = function(user) {
  return this.startDtLocal(user).add(this.duration_minutes || 60, 'm');
};

OpenSession.prototype.minutesToSession = function() {
  return moment(this.start_dt_utc).diff(moment(), 'minutes');
};

OpenSession.prototype.secondsToSession = function() {
  return moment(moment(this.start_dt_utc).diff(moment(), 'seconds'));
};

OpenSession.prototype.isStartingSoon = function() {
  return (
    !this.isCancelled() &&
    this.minutesToSession() <= 30 &&
    this.secondsToSession() > 0
  );
};

OpenSession.prototype.isHappeningNow = function(minutesBefore = 0) {
  // Can consider a session "Happening now" until `minutesBefore` before it ends
  return (
    !this.isCancelled() &&
    this.minutesToSession() > -1 * 60 + minutesBefore &&
    this.secondsToSession() < 0
  );
};

OpenSession.prototype.isPast = function() {
  return moment(this.start_dt_utc).add(this.duration_minutes, 'm') < moment();
};

OpenSession.prototype.isCancelled = function() {
  return !!this.cancelled_asof;
};

OpenSession.prototype.isUpcoming = function() {
  // An upcoming session is either starting soon or in progress
  return this.isStartingSoon() || this.isHappeningNow();
};

OpenSession.prototype.isInactive = function() {
  return this.isCancelled() || this.isPast();
};

OpenSession.prototype.isWorkshop = function() {
  return /(workshop|showcase)/.test(this.session_type);
};

OpenSession.prototype.userIsAttending = function(user) {
  return (
    user.exists() &&
    this.rsvp_contact_ids &&
    this.rsvp_contact_ids.indexOf(user.contact_id) > -1
  );
};

OpenSession.prototype.userIsHost = function(user) {
  return user.exists() && this.host.contact_id === user.contact_id;
};

OpenSession.prototype.hasRSVPs = function() {
  return this.rsvp_contact_ids && !!this.rsvp_contact_ids.length;
};

OpenSession.prototype.hasTags = function() {
  return !!this.tags.length;
};

OpenSession.prototype.detailPageUrl = function(config) {
  return `${config.officeHours.url}/${this.title_slug}-${this.id}`;
};

OpenSession.prototype.getTypeSlug = function() {
  return `${this.session_type.replace('_', '-')}s`;
};

module.exports = OpenSession;
