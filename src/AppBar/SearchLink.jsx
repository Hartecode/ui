const cx = require('classnames');
const React = require('react');
const TFAnalytics = require('@thinkful/tf-analytics');

const Icon = require('../Icon');
const SearchBar = require('../SearchBar');

const SLASH_KEY_CODE = 191;
const ESC_KEY_CODE = 27;

class SearchLink extends React.Component {
    static displayName = "SearchLink";

    static propTypes = {
        displayName: React.PropTypes.string,
        icon: React.PropTypes.string,
        onInput: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            open: false
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this._handleWindowKeyDown);
        window.addEventListener('searchUnload', this._handleSearchUnload);
        window.addEventListener('searchLoad', this._handleSearchLoad);

        this.setState({
            active: new RegExp(this.props.url, 'gi').
                test(location.toString())});
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._handleWindowKeyDown);
        window.removeEventListener('searchUnload', this._handleSearchUnload);
        window.removeEventListener('searchLoad', this._handleSearchLoad);}

    _handleWindowKeyDown = (event) => {
        if (event.which === SLASH_KEY_CODE) {
            // Disable events if in an input, textarea, etc
            if (document.activeElement.nodeName !== "BODY") {
                return false;
            }
            event.preventDefault();
            this.setState({open: true});
            this.refs.searchBar.autoFocus();
        }
        else if (event.which === ESC_KEY_CODE) {
            this.setState({open: false});
            this.refs.searchBar.unFocus();
        }
    }

    _handleSearchLoad = (event) => {
        this.setState({active: true});
    }

    _handleSearchUnload = (event) => {
        this.setState({active: false});
    }

    _handleSearchClick = event => {
        event.preventDefault();
        const {url, config, mobile} = this.props;

        if (!this.state.open) {
            TFAnalytics.track('clicked-search', {
                cateogry: 'splash-home',
                label: 'splash-header'
            });
        }

        mobile ?
            window.location = `${config.projects.url}/search`
        :   this.state.active ? this.refs.searchBar.wiggle()
        :   this.setState({open: !this.state.open});
    }

    render() {
        const {className, config, displayName, icon, url} = this.props;
        const {active, open} = this.state;

        return (
            <div className="search-container">
                <a className={cx(className, "app-nav-link")}
                   onClick={this._handleSearchClick}>
                    {icon &&
                        <Icon className="app-nav-icon" name={icon}/>
                    }
                    {displayName
                        && <span className="app-nav-text">{displayName}</span>
                    }
                </a>
                <SearchBar
                        active={active}
                        config={config}
                        className={cx(
                            'search-bar__nav', {
                                'search-bar__hidden': !open && !active,
                                'search-bar__active': active})}
                        open={open}
                        underlay={!active}
                        ref="searchBar"
                        handleClickAway={this._handleSearchClick}>
                </SearchBar>
            </div>
        )
    }
}

module.exports = SearchLink
