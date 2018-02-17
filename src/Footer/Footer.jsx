const cx = require('classnames');
const moment = require('moment');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');

const FACEBOOK_URL = 'https://www.facebook.com/thinkfulschool';
const TWITTER_URL = 'https://twitter.com/thinkful';

function generateSections(config) {
  const wwwUrl = config.www.url;
  return [
    {
      heading: 'Courses',
      links: [
        {
          name: 'Flexible Bootcamp',
          location: `${wwwUrl}/bootcamp/web-development/flexible/`,
          mobile: false
        },
        {
          name: 'Full Time Bootcamp',
          location: `${wwwUrl}/bootcamp/web-development/full-time/`,
          mobile: false
        },
        {
          name: 'Explore all courses',
          location: `${wwwUrl}/courses/`,
          mobile: true
        },
        {
          name: 'Corporate training',
          location: `${wwwUrl}/training-for-teams/`,
          mobile: true
        },
        {
          name: 'Bootcamp prep',
          location: `${wwwUrl}/bootcamp-prep/`,
          mobile: false
        },
        {
          name: 'Pricing',
          location: `${wwwUrl}/pricing/`,
          mobile: true
        }
      ]
    },
    {
      heading: 'Education',
      links: [
        {
          name: '1-on-1 mentorship',
          location: `${wwwUrl}/mentorship/`,
          mobile: false
        },
        {
          name: 'Bootcamp Finder',
          location: `${wwwUrl}/bootcamps/`,
          mobile: true
        },
        {
          name: 'Career prep',
          location: `${wwwUrl}/career-prep/`,
          mobile: false
        },
        {
          name: 'Job guarantee',
          location: `${wwwUrl}/career-path-job-guarantee/`,
          mobile: false
        },
        {
          name: 'Learning resources',
          location: `${wwwUrl}/learn/`,
          mobile: false
        },
        {
          name: 'Student outcomes',
          location: `${wwwUrl}/bootcamp-jobs-stats/`,
          mobile: false
        }
      ]
    },
    {
      heading: 'About',
      links: [
        {
          name: 'Blog',
          location: 'http://blog.thinkful.com',
          mobile: true
        },
        {
          name: 'Careers',
          location: `${wwwUrl}/about/#opportunities`,
          mobile: false
        },
        {
          name: 'Mentors',
          location: `${wwwUrl}/mentors/`,
          mobile: false
        },
        {
          name: 'Our mission',
          location: `${wwwUrl}/about/`,
          mobile: true
        },
        {
          name: 'Hiring network',
          location: `${wwwUrl}/hire-developers/`,
          mobile: true
        },
        {
          iconName: 'facebook',
          location: FACEBOOK_URL,
          mobile: false
        },
        {
          iconName: 'twitter',
          location: TWITTER_URL,
          mobile: false
        }
      ]
    }
  ];
}

const SectionLink = ({ className, iconName, location, mobile, name }) => (
  <a
    className={cx('footer-link', className, {
      icon: !!iconName,
      mobileHidden: !mobile
    })}
    href={location}
  >
    {iconName ? <Icon name={iconName} /> : name}
  </a>
);

SectionLink.propTypes = {
  className: PropTypes.string,
  iconName: PropTypes.string,
  location: PropTypes.string.isRequired,
  mobile: PropTypes.bool,
  name: PropTypes.string
};

const FooterColumn = ({ heading, links }) => (
  <div className="footer-column">
    <h4 className="footer-heading">{heading}</h4>
    {links.map((link, idx) => <SectionLink key={idx} {...link} />)}
  </div>
);

FooterColumn.propTypes = {
  heading: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired
};

const LegalLinks = ({ config }) => (
  <div className="legal-links">
    <span className="margin-span copyright">
      &copy; {moment().format('YYYY')} Thinkful, Inc.
    </span>
    <span className="margin-span middot-desktop">·</span>
    <SectionLink
      className="margin-span"
      location={`${config.www.url}/terms-of-service/`}
      name="Terms of use"
      mobile={true}
    />
    <span className="margin-span">·</span>
    <SectionLink
      className="margin-span"
      location={`${config.www.url}/privacy-policy/`}
      name="Privacy policy"
      mobile={true}
    />
    <span className="middot-desktop margin-span">·</span>
    <SectionLink
      className="support-desktop margin-span"
      location={`${config.www.url}/support/`}
      name="Support"
      mobile={false}
    />
    <span className="middot-desktop margin-span">·</span>
    <SectionLink
      className="margin-span"
      location={`${config.www.url}/responsible-disclosure/`}
      name="Responsible disclosure"
      mobile={true}
    />
  </div>
);

LegalLinks.propTypes = {
  config: PropTypes.object.isRequired
};

const Footer = ({ config, user }) => {
  // Can't be set via defaultProps because of frontend testing and global.__env
  config = config || global.__env.config;

  const sections = generateSections(config);

  return (
    <div className="footer-container">
      <footer className="footer">
        {user &&
          user.timezone && (
            <div className="timezone timezone__mobile">
              All times are in {user.timezone}
            </div>
          )}
        <div className="site-links">
          <div className="social-mobile">
            <a className="footer-link icon" href={FACEBOOK_URL}>
              <Icon name="facebook" />
            </a>
            <a className="footer-link icon" href={TWITTER_URL}>
              <Icon name="twitter" />
            </a>
          </div>
          {sections.map((section, idx) => (
            <FooterColumn key={idx} {...section} />
          ))}
          <SectionLink
            className="support-mobile"
            location={`${config.www.url}/support`}
            mobile={true}
            name="Support"
          />
        </div>
        {user &&
          user.timezone && (
            <div className="timezone">
              All times are in {user.timezone}&nbsp;&nbsp;
              <a href={`${config.settings.url}/profile`}>Change</a>
            </div>
          )}
        <LegalLinks config={config} />
      </footer>
    </div>
  );
};

Footer.propTypes = {
  config: PropTypes.object,
  user: PropTypes.object
};

Footer.defaultProps = {
  user: {}
};

module.exports = Footer;
