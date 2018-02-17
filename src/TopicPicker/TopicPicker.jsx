const cx = require('classnames');
const escapeStringRegexp = require('escape-string-regexp');
const marked = require('marked');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');
const Tag = require('../Tag');

const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const COMMA_KEY_CODE = 188;
const RETURN_KEY_CODE = 13;

const DEFAULT_MIN_TOPIC_LENGTH = 1;

const mapLower = v => v.toLowerCase();

/*
 * TopicPicker component
 *
 * Interface:
 *   use the `getTopics` function on the component to get the internal
 *   list of picked topics
 *
 * @property {Array} availableTopics the Array of topic to suggest
 * @property {Array} activeTopics the Array of topics to prefill
 * @property {Boolean} addMatchEmphasis Add `em` tags around tag matches
 * @property {String} className a className to add to component
 * @property {Func} handleUpdateTopics callback func on topic update
 * @property {Number} maxSuggestions The max number of suggestions to show
 * @property {Number} minTopicLength The min length a topic string must be
 */
class TopicPicker extends React.Component {
  constructor(props) {
    super(props);

    // Private methods
    this._filterTopicList = this._filterTopicList.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleMoveSelected = this._handleMoveSelected.bind(this);
    this._handlePatternChange = this._handlePatternChange.bind(this);
    this._handleAddTopic = this._handleAddTopic.bind(this);
    this._handleRemoveTopic = this._handleRemoveTopic.bind(this);
    this._handleTopicSubmit = this._handleTopicSubmit.bind(this);
    this._toggleFocus = this._toggleFocus.bind(this);

    // Public methods
    this.getTopics = this.getTopics.bind(this);

    this.state = {
      pattern: '',
      topics: props.activeTopics,
      selectedSuggestionIndex: -1
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ topics: newProps.activeTopics });
  }

  /*
   * Return the `availableTopics`, filtered for a matching pattern
   *
   * This makes the topics markdown to add emphasis if the property
   * `addMatchEmphasis` is truthy.
   */
  _filterTopicList(additionalTopics) {
    const { addMatchEmphasis, availableTopics, maxSuggestions } = this.props;
    const { pattern, topics } = this.state;

    // in case topic is something like `C++`
    const normalizedPattern = escapeStringRegexp(
      this.state.pattern.toLowerCase()
    );

    // find and mark the pattern matches in a case-insensitive way
    return (
      availableTopics
        // filter for matching available topics
        .filter(
          topic =>
            topic.toLowerCase().match(normalizedPattern) &&
            topics.indexOf(topic) < 0
        )
        // limit the number of results
        .slice(0, maxSuggestions)
        // add the asterisks for emphasis around matching area
        .map(topic => {
          if (addMatchEmphasis) {
            const firstIndex = topic
              .toLowerCase()
              .indexOf(topic.toLowerCase().match(normalizedPattern)[0]);
            const lastIndex = firstIndex + pattern.length + 1;

            let topicArray = topic.split('');
            topicArray.splice(firstIndex, 0, '*');
            topicArray.splice(lastIndex, 0, '*');

            return topicArray.join('');
          }
          return topic;
        })
    );
  }

  _handleKeyDown(event) {
    const { selectedSuggestionIndex } = this.state;
    const suggestions = this._filterTopicList();

    if (event.which === DOWN_ARROW_KEY_CODE) {
      this.setState({
        selectedSuggestionIndex: Math.min(
          selectedSuggestionIndex + 1,
          suggestions.length - 1
        )
      });
    } else if (event.which === UP_ARROW_KEY_CODE) {
      this.setState({
        selectedSuggestionIndex: Math.max(selectedSuggestionIndex - 1, 0)
      });
    } else if (
      event.which == COMMA_KEY_CODE ||
      event.which == RETURN_KEY_CODE
    ) {
      this._handleTopicSubmit(event);
    }
  }

  /*
   * Move the selected suggestion by `numMoves`
   *
   * Usable in keydown handler for moving selected topic in suggestion list
   */
  _handleMoveSelected(numMoves) {
    const { availableTopics } = this.props;
    const { selectedSuggestionIndex } = this.state;
    const newSelectedIndex = selectedSuggestionIndex + numMoves;

    if (
      newSelectedIndex >= -1 &&
      newSelectedIndex < (availableTopics || []).length
    ) {
      this.setState({ selectedSuggestionIndex: newSelectedIndex });
    }
  }

  /*
   * Handler for a form change
   */
  _handlePatternChange(event) {
    this.setState({ pattern: event.target.value });
  }

  /*
   * Add a topic to the internal list of topics
   */
  _handleAddTopic(topic) {
    const { topics } = this.state;
    const { handleUpdateTopics } = this.props;

    if (topics.map(mapLower).indexOf(topic.toLowerCase()) < 0) {
      // We trim the whitespace off the tag before adding it
      let newTopics = topics.concat(topic.trim());
      this.setState({ topics: newTopics });
      handleUpdateTopics(newTopics);
    }

    this.setState({ pattern: '', selectedSuggestionIndex: -1 });
  }

  /*
   * Remove a topic from the internal list of topics, if it's present
   *
   * Matching is case-sensitive
   */
  _handleRemoveTopic(topic) {
    const { topics } = this.state;
    const { handleUpdateTopics } = this.props;

    let newTopics = topics.filter(t => t !== topic);

    this.setState({ topics: newTopics });
    handleUpdateTopics(newTopics);
  }

  /*
   * Handle submission of a new topic
   */
  _handleTopicSubmit(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const { selectedSuggestionIndex } = this.state;
    let topic;

    if (selectedSuggestionIndex > -1) {
      topic = this._filterTopicList()[selectedSuggestionIndex];
    } else {
      topic = this.state.pattern;
    }

    if (topic.trim().length >= this.props.minTopicLength) {
      this._handleAddTopic(topic.trim());
    }
  }

  _toggleFocus() {
    this.setState({ isFocused: !this.state.isFocused });
  }

  /*
   * Getter for topics
   */
  getTopics() {
    return this.state.topics;
  }

  render() {
    const { className, placeholderText } = this.props;
    const { isFocused, pattern, selectedSuggestionIndex, topics } = this.state;

    return (
      <div
        className={cx(
          'topic-picker',
          className,
          isFocused && 'topic-picker-focus'
        )}
      >
        {/* The existing topics */}
        {topics.map((topic, index) => (
          <Tag key={index} className="topic" displayName={topic}>
            <div
              className="topic-delete-button"
              onClick={event => this._handleRemoveTopic(topic)}
            >
              <Icon name="close" />
            </div>
          </Tag>
        ))}

        <div
          className="topic-form"
          onKeyDown={this._handleKeyDown}
          onSubmit={this._handleTopicSubmit}
        >
          <input
            onFocus={this._toggleFocus}
            onBlur={this._toggleFocus}
            className="topic-form-input"
            type="text"
            value={pattern}
            placeholder={placeholderText}
            onChange={this._handlePatternChange}
          />

          {/* The list of topic suggestions */}
          {pattern && (
            <ul className="topic-suggestion-list">
              {this._filterTopicList().map((topic, index) => (
                <li
                  key={index}
                  className={cx('topic-list-item', {
                    selected: index === selectedSuggestionIndex
                  })}
                  onClick={event =>
                    this._handleAddTopic(topic.replace(/\*/g, ''))
                  }
                  dangerouslySetInnerHTML={{ __html: marked(topic) }}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

TopicPicker.propTypes = {
  activeTopics: PropTypes.array,
  availableTopics: PropTypes.array,
  addMatchEmphasis: PropTypes.bool,
  className: PropTypes.string,
  handleUpdateTopics: PropTypes.func,
  maxSuggestions: PropTypes.number,
  minTopicLength: PropTypes.number
};

TopicPicker.defaultProps = {
  availableTopics: [],
  activeTopics: [],
  maxSuggestions: 10,
  minTopicLength: DEFAULT_MIN_TOPIC_LENGTH,
  placeholderText: "Add a tag (hit 'return' after each one)",
  // if parent doesn't pass in callback, to avoid conditionals inline
  handleUpdateTopics: () => null
};

module.exports = TopicPicker;
