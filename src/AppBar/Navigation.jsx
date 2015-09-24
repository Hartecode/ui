const cx = require('classnames');
const React = require('react');
const _ = require('lodash');
const uniqueId = require('lodash/utility/uniqueId');

// TUI Components
const {Icon} = require('../Icon');
const {Gravatar} = require('../Gravatar');
const {NavLink} = require('./NavLink');
const {Notifications} = require('./notifications/Notifications');
const {CourseLink} = require('./CourseLink');
const linkSet = require('./linkSet');


/**
 * AppNav
 * @property {} description
 */
class AppNav extends React.Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        config: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isMenuVisible: false,
            isCourseDropdownVisible: false
        };

        this._toggleMenu = this._toggleMenu.bind(this);
        this._toggleCourseDropdown = this._toggleCourseDropdown.bind(this);
        this._handleMouseEnter = this._handleMouseEnter.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
    }

    _toggleMenu() {
        this.setState({
            isMenuVisible: ! this.state.isMenuVisible
        });
    }

    _toggleCourseDropdown() {
        this.setState({
            isCourseDropdownVisible: ! this.state.isCourseDropdownVisible
        });
    }


    _handleMouseEnter(event) {
        if (this.mouseTimeout) {
            clearTimeout(this.mouseTimeout);
        }
    }

    _handleMouseLeave(event) {
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
          this.setState({
            isMenuVisible: false,
            isCourseDropdownVisible: false
          })
        }, 400);
    }

    renderAuthed(user, config) {
        const navClassName = cx(
            'app-nav', {'app-nav__visible': this.state.isMenuVisible});

        return (
            <div className='app-nav-container'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName}
                     key="main-navigation"
                     rel="main-navigation">
                    <a href={linkSet.home.url}><div dangerouslySetInnerHTML={{__html: require('./images/white_t_logo.svg')}}>
                    </div></a>
                    <ul className="app-nav-main">
                        {linkSet.main.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink {...link} /></li>)}
                    </ul>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className="app-nav-list">
                        {linkSet.main.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className="app-nav-link__mobile-only"
                                    {...link} /></li>)}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className="app-nav-link__in-menu"
                                    {...link}/></li>)}
                    </ul>
                    { (
                        global.__env &&
                        global.__env.user &&
                        global.__env.user.access &&
                        _.indexOf(global.__env.user.access, 'navbar-notifcations') !== -1) ?
                        <Notifications /> : ''
                    }
                    <a className="app-nav-link app-nav-link__toggle" onClick={this._toggleMenu}>
                        <span alt="Menu" className="app-nav-burger"></span>
                        <Gravatar className="app-nav-gravatar" email={user.tf_login} size={120}/>
                    </a>
                </nav>
            </div>
        )
    }

    renderCourseDropdown() {
      const dropdownContentClasses = cx("app-nav-course-dropdown-content",
        {"app-nav-course-dropdown-content__visible" : this.state.isCourseDropdownVisible});

      return (
        <div className="app-nav-course-dropdown">
          <span className='app-nav-link'
                onClick={this._toggleCourseDropdown}>1-on-1 Courses
            <Icon className='app-nav-link-down-arrow' name='navigatedown' />
          </span>
          <div onMouseEnter={this._handleMouseEnter}
               className={dropdownContentClasses}>
            <div className="subheading">Part-time</div>
            <div className="app-nav-courses">
              <CourseLink href="//www.thinkful.com/courses/learn-web-development-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/frontend.svg"
                          name="Frontend Development" />
              <CourseLink href="//www.thinkful.com/courses/learn-ux-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/uxd.svg"
                          name="User Experience Design" />
              <CourseLink href="//www.thinkful.com/courses/learn-angularjs-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/angular.svg"
                          name="Frontend in AngularJS" />
              <CourseLink href="//www.thinkful.com/courses/learn-web-design-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/design.svg"
                          name="Modern Web Design" />
              <CourseLink href="//www.thinkful.com/courses/learn-python-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/python.svg"
                          name="Programming in Python" />
              <CourseLink href="//www.thinkful.com/courses/learn-swift-programming-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/swift.svg"
                          name="iOS Programming in Swift" />
              <CourseLink href="//www.thinkful.com/courses/learn-ruby-on-rails-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/ruby.svg"
                          name="Web Development in Rails" />
              <CourseLink href="//www.thinkful.com/courses/learn-android-programming-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/android.svg"
                          name="Android Mobile Development" />
              <CourseLink href="//www.thinkful.com/courses/learn-nodejs-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/node.svg"
                          name="Backend in Node.js" />
              <CourseLink href="//www.thinkful.com/courses/learn-data-science-online"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/data.svg"
                          name="Data Science in Python" />
            </div>
            <div className="subheading">Full-time</div>
            <div className="app-nav-courses">
              <CourseLink href="//www.thinkful.com/courses/frontend-development-career-path"
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/career.svg"
                          name="Frontend Career Path" />
            </div>
            <div className="app-nav-courses app-nav-courses__center">
              <CourseLink href="//www.thinkful.com/courses/"
                          name="See details"
                          arrow={true} />
            </div>
          </div>
        </div>);
    }

    renderUnauthed(config) {
        const navClassName = cx(
            'app-nav', {'app-nav__visible': this.state.isMenuVisible});

        return (
            <div className='app-nav-container app-nav-container__unauthed'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName} rel="main-navigation">
                    <a href={linkSet.home.url}><div dangerouslySetInnerHTML={{__html: require('./images/blue_full_logo.svg')}}>
                    </div></a>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className='app-nav-list'>
                        {linkSet.insertCourseDropdown && this.renderCourseDropdown()}
                        {linkSet.insertCourseDropdown && <li key="courseDropdown">
                            <NavLink className='app-nav-link__mobile-only'
                                     displayName='Courses'
                                     url='//www.thinkful.com/courses' />
                          </li>}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className='app-nav-link__in-menu'
                                    {...link}/></li>)}
                    </ul>
                    <a className='app-nav-link app-nav-link__toggle' onClick={this._toggleMenu}>
                        <span alt='Menu' className='app-nav-burger'></span>
                    </a>
                </nav>
            </div>
        )
    }

    render() {
        const {user, config} = this.props;

        return user && user.tf_login ?
            this.renderAuthed(user, config) : this.renderUnauthed(config);
    }
}

module.exports = AppNav;
