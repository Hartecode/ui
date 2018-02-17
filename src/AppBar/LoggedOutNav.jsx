const cx = require('classnames');
const React = require('react');

const Icon = require('../Icon');

const courseDropdownItems = [
  {
    href: '/courses/',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/wow-next/splash-nav/master-a-new-skill.gz.svg',
    title: 'Skills courses'
  },
  {
    href: '/training-for-teams',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/splash/nav-icons/corporate-round.gz.svg',
    title: 'Training for teams'
  }
];

const educationDropdownItems = [
  {
    href: '/mentorship/',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/splash/nav-icons/mentorship.gz.svg',
    title: '1-on-1 mentorship'
  },
  {
    href: '/career-prep/',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/splash/nav-icons/career-services.gz.svg',
    title: 'Career prep'
  },
  {
    href: '/bootcamp-job-guarantee/',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/splash/nav-icons/guarantee.gz.svg',
    title: 'Job guarantee'
  },
  {
    href: '/bootcamp-jobs-stats/',
    imageUrl:
      '//tf-assets-prod.s3.amazonaws.com/splash/nav-icons/jobs-report.gz.svg',
    title: 'Student outcomes'
  }
];

const NavDropdownItem = ({ config, href, imageUrl, title }) => (
  <li className="splash-nav-dropdown-item">
    <a
      className="splash-nav-dropdown-padding"
      href={`${config.www.url}${href}`}
    >
      <img src={imageUrl} />
      <h4 className="splash-nav-dropdown-title">{title}</h4>
    </a>
  </li>
);

class LoggedOutNav extends React.Component {
  constructor(props) {
    super(props);

    this._handleToggleCoursesDropdown = this._handleToggleCoursesDropdown.bind(
      this
    );
    this._handleToggleEducationDropdown = this._handleToggleEducationDropdown.bind(
      this
    );
    this._handleToggleHamburger = this._handleToggleHamburger.bind(this);

    this.state = {
      coursesDDVisible: false,
      educationDDVisible: false,
      hamburgerOff: true
    };
  }

  _handleToggleCoursesDropdown(event) {
    event.preventDefault();
    this.setState({
      coursesDDVisible: !this.state.coursesDDVisible,
      educationDDVisible: false
    });
  }

  _handleToggleEducationDropdown(event) {
    event.preventDefault();
    this.setState({
      coursesDDVisible: false,
      educationDDVisible: !this.state.educationDDVisible
    });
  }

  _handleToggleHamburger(event) {
    event.preventDefault();
    this.setState({
      hamburgerOff: !this.state.hamburgerOff
    });
  }

  render() {
    const { config } = this.props;
    const { coursesDDVisible, educationDDVisible, hamburgerOff } = this.state;

    return (
      <div className={cx('splash-nav', { 'hamburger-off': hamburgerOff })}>
        <div className="hamburger" onClick={this._handleToggleHamburger}>
          <div className="hamburger-stripe" />
          <div className="hamburger-stripe" />
          <div className="hamburger-stripe" />
        </div>
        <div className="splash-nav-desktop-grid">
          <ul className="splash-nav-primary">
            <li className="splash-nav-item splash-nav-item__logo">
              <a href={`${config.www.url}/`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="136"
                  height="28"
                  className="splash-nav-logo"
                >
                  <g fill="#6799ff" fill-rule="evenodd">
                    <path d="M9 20h3V8H3V3h17V0H0v11h9v9z" />
                    <path d="M17 8v17H9v3h11V11h8V0h-3v8h-8zm25 3.5V20h3v-8.5h3.5V9h-10v2.5H42zM66 9v11h3V9h-3zm-11 4V9h-3v11h3v-4.5h4V20h3V9h-3v4h-4zm45 7h3v-4h5v-2.4h-5v-2h5.5V9H100v11zm-20-4.5L76 9h-3v11h3v-6.5l4 6.5h3V9h-3v6.5zM130 9h-3v11h8.5v-2.5H130V9zM93.5 9L90 14V9h-3v11h3v-5l3.5 5H97l-4-5.5L97 9h-3.5zm24 11.5c3 0 5.5-2.5 5.5-5.5V9h-3v5.5c0 1.5-.5 3-2.5 3s-2.5-1.5-2.5-3V9h-3v6c0 3 2.5 5.5 5.5 5.5z" />
                  </g>
                </svg>
              </a>
            </li>
            <li className="splash-nav-item">
              <a
                href="#"
                className="splash-nav-toggle"
                id="splash-nav-courses-toggle"
                onClick={this._handleToggleCoursesDropdown}
              >
                Courses{' '}
                <Icon name={coursesDDVisible ? 'navigateup' : 'navigatedown'} />
              </a>

              <div
                id="splash-nav-courses-dropdown"
                className={cx('splash-nav-dropdown', {
                  'splash-nav-dropdown__visible': coursesDDVisible
                })}
              >
                <ul>
                  <li className="splash-nav-dropdown-item">
                    <div className="splash-nav-dropdown-padding">
                      <a
                        className="splash-nav-bootcamp-link"
                        href={`${config.www.url}/bootcamp/web-development/`}
                      >
                        <img
                          className="splash-nav-dropdown-image__wdcp"
                          src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/career.gz.svg"
                        />
                        <h4 className="splash-nav-dropdown-title splash-nav-dropdown-title__wdcp">
                          Web Development Bootcamp
                        </h4>
                      </a>
                      <div className="splash-nav-dropdown-cp-links">
                        <a
                          href={`${
                            config.www.url
                          }/bootcamp/web-development/flexible/`}
                        >
                          Flexible
                        </a>
                        <a
                          href={`${
                            config.www.url
                          }/bootcamp/web-development/full-time/`}
                        >
                          Full Time
                        </a>
                      </div>
                    </div>
                  </li>
                  {courseDropdownItems.map((item, idx) => (
                    <NavDropdownItem
                      config={config}
                      key={idx}
                      href={item.href}
                      imageUrl={item.imageUrl}
                      title={item.title}
                    />
                  ))}
                </ul>
              </div>
            </li>

            <li className="splash-nav-item">
              <a
                href="#"
                id="splash-nav-education-toggle"
                onClick={this._handleToggleEducationDropdown}
              >
                How it works{' '}
                <Icon
                  name={educationDDVisible ? 'navigateup' : 'navigatedown'}
                />
              </a>

              <div
                id="splash-nav-education-dropdown"
                className={cx('splash-nav-dropdown', {
                  'splash-nav-dropdown__visible': educationDDVisible
                })}
              >
                <ul>
                  {educationDropdownItems.map((item, idx) => (
                    <NavDropdownItem
                      config={config}
                      key={idx}
                      href={item.href}
                      imageUrl={item.imageUrl}
                      title={item.title}
                    />
                  ))}
                </ul>
              </div>
            </li>

            <li className="splash-nav-item">
              <a href={`${config.www.url}/reviews/`}>Reviews</a>
            </li>
            <li className="splash-nav-item">
              <a href={`${config.www.url}/pricing/`}>Pricing</a>
            </li>
          </ul>

          <ul className="splash-nav-secondary">
            <li className="splash-nav-item">
              <a href={`${config.dashboard.url}/`}>Sign in</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

LoggedOutNav.propTypes = {
  config: PropTypes.object.isRequired
};

module.exports = LoggedOutNav;
