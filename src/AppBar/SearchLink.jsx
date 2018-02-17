const cx = require('classnames');
const React = require('react');
const TFAnalytics = require('@thinkful/tf-analytics');

const Icon = require('../Icon');
const SearchBar = require('../SearchBar');

const SLASH_KEY_CODE = 191;
const ESC_KEY_CODE = 27;

class SearchLink extends React.Component {
  constructor(props) {
    super(props);

    this._handleWindowKeyDown = this._handleWindowKeyDown.bind(this);
    this._handleSearchLoad = this._handleSearchLoad.bind(this);
    this._handleSearchUnload = this._handleSearchUnload.bind(this);
    this._handleSearchClick = this._handleSearchClick.bind(this);

    this.state = {
      active: false,
      open: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleWindowKeyDown);
    window.addEventListener('searchUnload', this._handleSearchUnload);
    window.addEventListener('searchLoad', this._handleSearchLoad);

    this.setState({
      active: new RegExp(this.props.url, 'gi').test(location.toString())
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleWindowKeyDown);
    window.removeEventListener('searchUnload', this._handleSearchUnload);
    window.removeEventListener('searchLoad', this._handleSearchLoad);
  }

  _handleWindowKeyDown(event) {
    if (event.which === SLASH_KEY_CODE) {
      // Disable events if in an input, textarea, etc
      if (document.activeElement.nodeName !== 'BODY') {
        return false;
      }
      event.preventDefault();
      this.setState({ open: true });
      this.searchBar.autoFocus();
    } else if (event.which === ESC_KEY_CODE) {
      this.setState({ open: false });
      this.searchBar.unFocus();
    }
  }

  _handleSearchLoad(event) {
    this.setState({ active: true });
  }

  _handleSearchUnload(event) {
    this.setState({ active: false });
  }

  _handleSearchClick(event) {
    event.preventDefault();

    const { config, mobild, url } = this.props;
    const { active, open } = this.state;

    if (!open) {
      TFAnalytics.track('clicked-search', {
        cateogry: 'splash-home',
        label: 'splash-header'
      });
    }

    mobile
      ? (window.location = `${config.projects.url}/search`)
      : active ? this.searchBar.wiggle() : this.setState({ open: !open });
  }

  render() {
    const { className, config, displayName, icon, url } = this.props;
    const { active, open } = this.state;

    return (
      <div className="search-container">
        <a
          className={cx(className, 'app-nav-link')}
          onClick={this._handleSearchClick}
        >
          {icon && <Icon className="app-nav-icon" name={icon} />}
          {displayName && <span className="app-nav-text">{displayName}</span>}
        </a>
        <SearchBar
          active={active}
          config={config}
          className={cx('search-bar__nav', {
            'search-bar__hidden': !open && !active,
            'search-bar__active': active
          })}
          open={open}
          underlay={!active}
          ref={c => (this.searchBar = c)}
          handleClickAway={this._handleSearchClick}
        />
      </div>
    );
  }
}

SearchLink.propTypes = {
  displayName: PropTypes.string,
  icon: PropTypes.string,
  onInput: PropTypes.func,
  onSubmit: PropTypes.func
};

module.exports = SearchLink;
