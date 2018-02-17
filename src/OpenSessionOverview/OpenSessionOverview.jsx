const cx = require('classnames');
const _ = require('lodash');
const moment = require('moment-timezone');
const PropTypes = require('prop-types');
const React = require('react');
const { Link } = require('react-router');

const Gravatar = require('../Gravatar');
const Icon = require('../Icon');
const Tag = require('../Tag');

const FALLBACK_QA_DESCRIPTION =
  'Have questions? Get answers! Check out the topic tags to the right. If you see one that fits your question, feel free to hop in the session. You can stay for the full hour or just long enough to get your answer. Ask about projects, concepts, or the industry.';

const OverviewContent = ({ session: { description, host, title } }) => (
  <div className="overview-content">
    <h3 className="title" itemProp="name">
      {title}
    </h3>
    <p className="host-name">with {host.name}</p>
    <p className="overview-description" itemProp="description">
      {description || FALLBACK_QA_DESCRIPTION}
    </p>
  </div>
);

OverviewContent.propTypes = {
  session: PropTypes.shape({
    description: PropTypes.string.isRequired,
    host: PropTypes.shape({ name: PropTypes.string.isRequired }),
    title: PropTypes.string.isRequired
  }).isRequired
};

/**
 * OpenSessionOverview component
 */
class OpenSessionOverview extends React.Component {
  constructor(props) {
    super(props);

    this._renderQASessionCtas = this._renderQASessionCtas.bind(this);
    this._renderWorkshopCta = this._renderWorkshopCta.bind(this);
    this._shouldRenderMobile = this._shouldRenderMobile.bind(this);
    this._handleRSVPButtonClick = this._handleRSVPButtonClick.bind(this);

    this.state = {
      requestPending: false
    };
  }

  _shouldRenderMobile() {
    return this.props.previewing;
  }

  _participantList() {
    if (this.props.participants.length > 0) {
      return (
        <div className="qa-session-participants">
          <div className="subheading">Participants</div>
          {this._renderGravatars()}
        </div>
      );
    }
  }

  _renderGravatars() {
    const { config, participants } = this.props;

    return participants.map((p, idx) => {
      return (
        <div className="qa-session-participants__item" key={idx}>
          <a href={`${config.dashboard.url}/student/${p.contact_id}`}>
            <Gravatar
              className="gravatar-image__participant"
              src={p.image_url}
              email={p.email}
            />
            <div>{p.name}</div>
          </a>
        </div>
      );
    });
  }

  _handleRSVPButtonClick(e, id) {
    this.setState({ requestPending: true });
    this.props.handleRSVPClick(id);
  }

  render() {
    const {
      attending,
      className,
      config,
      hosting,
      linkTo,
      linkedSession,
      previewing,
      session,
      user
    } = this.props;

    const {
      description,
      detail_page_url,
      duration_minutes,
      hero_image_url,
      host,
      id,
      project,
      rsvp_contact_ids,
      session_type,
      start_dt_utc,
      tags,
      title,
      title_slug
    } = session;

    const style = {
      workshop: {
        backgroundImage: `url(${hero_image_url || host.image_url})`,
        backgroundPosition: '50% 50%'
      },
      qaSession: { backgroundImage: `url(${host.image_url})` }
    };

    return (
      <div
        className={cx(
          'session',
          {
            session__past: session.isPast(),
            'render-mobile': this._shouldRenderMobile()
          },
          className
        )}
        itemType="http://schema.org/Event"
        itemScope=""
      >
        <div className="session-image-wrapper">
          {session.isStartingSoon() && (
            <div className="session-time-alert">Starting soon!</div>
          )}
          {session.isHappeningNow() && (
            <div className="session-time-alert">Happening now!</div>
          )}
          {linkedSession ? (
            <Icon name="navigateright" className="linked-session-icon" />
          ) : (
            attending && <Icon name="alarmclock" className="alarm-icon" />
          )}
          {!session.isPast() && (
            <div
              itemProp="startDate"
              content={session.startDtLocal(user).format()}
              className="session-time"
            >
              {session.startDtLocal(user).format('h:mm A')}&nbsp;&ndash;&nbsp;
              {session.endDtLocal(user).format('h:mm A')}
              <br />
              {session.startDtLocal(user).format('MMM Do')}
            </div>
          )}
          <div
            className="image-primary"
            itemProp="photo"
            style={session.isWorkshop() ? style.workshop : style.qaSession}
          />
          {session.isWorkshop() &&
            hero_image_url && (
              <img className="image-secondary" src={host.image_url} />
            )}
        </div>

        <div className="session-overview-wrapper">
          {!session.published_asof && (
            <div className="session-draft-notice">Draft</div>
          )}
          {linkTo ? (
            <Link
              itemProp="url"
              params={{ slug: title_slug, id: id }}
              to={linkTo}
            >
              <OverviewContent session={session} />
            </Link>
          ) : (
            <a href={detail_page_url} itemProp="url">
              <OverviewContent session={session} />
            </a>
          )}
          <div className="session-cta">
            {session.isWorkshop()
              ? this._renderWorkshopCta()
              : this._renderQASessionCtas()}
            {!!tags.length && (
              <div className="session-tags">
                {tags.map((t, idx) => (
                  <Tag
                    key={idx}
                    displayName={t}
                    url={`${config.projects.url}/search?q=${t}`}
                  />
                ))}
              </div>
            )}
            {rsvp_contact_ids &&
              !!rsvp_contact_ids.length && (
                <div className="session-attendees">
                  <Icon name="users" />
                  <span>
                    {' '}
                    {
                      rsvp_contact_ids.length
                    } attendee{rsvp_contact_ids.length !== 1 && 's'}
                  </span>
                  {user &&
                    user.role === 'admin' &&
                    session.session_type === 'info-session' && (
                      <a
                        href={`https://www.adminium.io/resources/open_session_rsvps?where%5Bopen_session_id%5D=${
                          session.id
                        }`}
                        target="_blank"
                      >
                        &nbsp;see in adminium
                      </a>
                    )}
                </div>
              )}
          </div>
          <div>
            {user &&
              (user.role === 'admin' || session.userIsHost(user)) &&
              session.session_type === 'qa_session' &&
              this._participantList()}
          </div>
        </div>
      </div>
    );
  }

  _renderWorkshopCta() {
    const { linkTo, session } = this.props;
    const { detail_page_url, id, session_type, title_slug } = session;
    return (
      <div className="workshop-cta">
        {linkTo ? (
          <Link
            className="button"
            params={{ slug: title_slug, id: id }}
            to={linkTo}
          >
            View details
            <Icon name="navigateright" className="button-right-icon" />
          </Link>
        ) : (
          <a className="button" href={detail_page_url}>
            View details
            <Icon name="navigateright" className="button-right-icon" />
          </a>
        )}
      </div>
    );
  }

  _renderQASessionCtas() {
    const {
      attending,
      config,
      handleCancelRSVPClick,
      handleCancelSessionClick,
      handleCancelAllSessionsClick,
      handleEditSessionClick,
      hosting,
      linkToCalendar,
      previewing,
      session,
      user
    } = this.props;
    const { requestPending } = this.state;
    const { detail_page_url, id } = session;

    const userIsActive = !_.isEmpty(user) && user.account_status === 'active';

    return (
      <div className="qa-session-ctas">
        {linkToCalendar ? (
          <a className="button" href={detail_page_url}>
            View on calendar
            <Icon name="navigateright" className="button-right-icon" />
          </a>
        ) : !userIsActive ? (
          <a
            className="button"
            href={`${config.tfl_enroll.url}?rel=qa-session-details`}
          >
            RSVP
            <Icon name="navigateright" className="button-right-icon" />
          </a>
        ) : hosting ? (
          <div className="host-ctas">
            <a
              className={cx('button button__black button__black__host', {
                disabled: previewing
              })}
              href={session.session_room_url}
            >
              Go to room
              <Icon name="navigateright" className="button-right-icon" />
            </a>
            {!previewing && (
              <div>
                <a onClick={e => handleEditSessionClick(id)}>Edit</a>
                {' / '}
                <a onClick={e => handleCancelSessionClick(id)}>Cancel</a>
                {!!session.blueprint_id && (
                  <span>
                    {' / '}
                    <a onClick={e => handleCancelAllSessionsClick(id)}>
                      Cancel all
                    </a>
                  </span>
                )}
              </div>
            )}
          </div>
        ) : session.isUpcoming() ? (
          <a className="button button__black" href={session.session_room_url}>
            Go to room
            <Icon name="navigateright" className="button-right-icon" />
          </a>
        ) : attending ? (
          <div className="user-attending">
            <h5>Your spot is reserved</h5>
            <a href={session.session_room_url}>Go to room</a>
            {' / '}
            <a onClick={e => handleCancelRSVPClick(id)}>Cancel reservation</a>
          </div>
        ) : (
          <div
            className={cx('button', { button__disabled: requestPending })}
            onClick={e => this._handleRSVPButtonClick(e, id)}
          >
            RSVP
            <Icon name="navigateright" className="button-right-icon" />
          </div>
        )}
      </div>
    );
  }
}

OpenSessionOverview.propTypes = {
  attending: PropTypes.bool,
  config: PropTypes.object,
  handleCancelRSVPClick: PropTypes.func,
  handleRSVPClick: PropTypes.func,
  handleCancelSessionClick: PropTypes.func,
  handleCancelAllSessionsClick: PropTypes.func,
  handleEditSessionClick: PropTypes.func,
  hosting: PropTypes.bool,
  previewing: PropTypes.bool,
  session: PropTypes.object.isRequired,
  participants: PropTypes.array,
  user: PropTypes.object
};

OpenSessionOverview.defaultProps = {
  attending: false,
  hosting: false,
  linkToCalendar: false,
  previewing: false,
  participants: [],
  tags: []
};

module.exports = OpenSessionOverview;
