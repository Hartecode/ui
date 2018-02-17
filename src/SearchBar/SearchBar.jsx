const React = require('react');
const PropTypes = require('prop-types');
const cx = require('classnames');

const Icon = require('../Icon');
const SearchActions = require('./SearchActions');

const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const ENTER_KEY_CODE = 13;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputClassName: [],
      searchTerm: this._determineSearchTerm() || '',
      selectedSuggestionIdx: -1,
      suggestions: []
    };
  }

  componentDidMount() {
    SearchActions.getSuggestions.completed.listen(
      this._onGetSuggestionsCompleted
    );
    this.input.addEventListener('keydown', this._handleKeyDown);

    const underlay = this.underlay;
    underlay && underlay.addEventListener('click', this._handleClickAway);
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this._handleKeyDown);

    const underlay = this.underlay;
    underlay && underlay.removeEventListener('click', this._handleClickAway);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open || newProps.active) {
      this._autoFocus();
    }
  }

  _determineSearchTerm() {
    const urlParams = location.search.substring(1).split('&');
    const query = urlParams.filter(set => set.split('=')[0] === 'q');
    return query.length && decodeURIComponent(query[0].split('=')[1]);
  }

  _autoFocus = () => {
    this.input.focus();

    // Force the cursor to go to the end of the input text
    this.input.value = this.state.searchTerm;
  };

  autoFocus = () => {
    this._autoFocus();
  };

  _unFocus = () => {
    this.input.blur();
  };

  unFocus = () => {
    this._unFocus();
  };

  _wiggle = () => {
    this._autoFocus();
    this._addInputClass('wiggle');
    window.setTimeout(() => this._removeInputClass('wiggle'), 1000);
  };

  wiggle = () => {
    this._wiggle();
  };

  _addInputClass = className => {
    this.setState({
      inputClassName: this.state.inputClassName.concat(className)
    });
  };

  _removeInputClass = className => {
    this.setState({
      inputClassName: this.state.inputClassName.filter(cn => cn !== className)
    });
  };

  _onGetSuggestionsCompleted = response => {
    this.setState({
      suggestions: response,
      selectedSuggestionIdx: !response.length
        ? -1
        : this.state.selectedSuggestionIdx
    });
  };

  _handleClickAway = event => {
    const { handleClickAway } = this.props;
    handleClickAway(event);
  };

  _handleFormInput = event => {
    SearchActions.getSuggestions(event.target.value, this.props.config);
    this.setState({ searchTerm: event.target.value });
  };

  _handleClickSuggestion = suggestion => {
    this.setState({ searchTerm: suggestion }, () => this._handleSubmitForm());
  };

  _handleKeyDown = event => {
    const { searchTerm, selectedSuggestionIdx, suggestions } = this.state;

    if (event.which === DOWN_ARROW_KEY_CODE) {
      this._handleMoveDownSelection();
    } else if (event.which === UP_ARROW_KEY_CODE) {
      this._handleMoveUpSelection();
    } else if (event.which === ENTER_KEY_CODE) {
      this._handleSubmitForm();
    }
  };

  _handleMoveDownSelection = () => {
    const { selectedSuggestionIdx, suggestions } = this.state;
    const newIdx = Math.min(selectedSuggestionIdx + 1, suggestions.length - 1);
    this.setState({
      selectedSuggestionIdx: newIdx,
      searchTerm: suggestions[newIdx].text
    });
  };

  _handleMoveUpSelection = () => {
    const { selectedSuggestionIdx, suggestions } = this.state;
    const newIdx = Math.max(selectedSuggestionIdx - 1, 0);
    this.setState({
      selectedSuggestionIdx: newIdx,
      searchTerm: suggestions[newIdx].text
    });
  };

  _handleSuggestionMouseEnter = idx => {
    this.setState({
      selectedSuggestionIdx: idx,
      searchTerm: this.state.suggestions[idx].text
    });
  };

  _handleClearInput = () => {
    this.setState({
      searchTerm: '',
      selectedSuggestionIdx: -1,
      suggestions: []
    });
    this._autoFocus();
  };

  _handleSubmitForm = event => {
    if (event) {
      event.preventDefault();
    }
    const { config } = this.props;

    window.location = `${config.projects.url}/search?q=${encodeURIComponent(
      this.state.searchTerm
    )}`;
  };

  render() {
    const { active, className, config, heading, underlay, open } = this.props;
    const {
      inputClassName,
      searchTerm,
      selectedSuggestionIdx,
      suggestions
    } = this.state;

    return (
      <div className={cx('search-bar', className)}>
        {underlay && (
          <div className="search-underlay" ref={ref => (this.underlay = ref)} />
        )}
        <div className="search-form-container">
          <form className="search-form" onSubmit={this._handleSubmitForm}>
            <Icon name="search" className="icon-search" />
            <input
              className={cx('search-input', inputClassName)}
              ref={ref => (this.input = ref)}
              type="text"
              placeholder="Search"
              onChange={this._handleFormInput}
              value={searchTerm}
            />
            {!!searchTerm.length && (
              <Icon
                name="close"
                className="icon-close"
                onClick={this._handleClearInput}
              />
            )}
          </form>
          <a
            className={cx('search-home-link', {
              'search-home-link__active-hidden': !searchTerm.length
            })}
            href={`${config.projects.url}/search`}
          >
            Browse by topic
            <Icon name="navigateright" />
          </a>
        </div>
        {!!suggestions.length && (
          <div className="search-suggestions">
            {suggestions.map((term, idx) => (
              <div
                key={term.text}
                className={cx('suggestion-item', {
                  'suggestion-item__active': idx === selectedSuggestionIdx
                })}
                onClick={this._handleSubmitForm}
                onMouseEnter={e => this._handleSuggestionMouseEnter(idx)}
              >
                <p>{term.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

SearchBar.propTypes = {
  handleClickAway: PropTypes.func,
  heading: PropTypes.bool,
  open: PropTypes.bool,
  underlay: PropTypes.bool
};

SearchBar.defaultProps = {
  underlay: false,
  heading: false,
  open: false
};

module.exports = SearchBar;
