const cx = require('classnames');
const escapeStringRegexp = require('escape-string-regexp');
const marked = require('marked');
const React = require('react');

const {Icon} = require('../Icon');
const {Tag} = require('../Tag');

const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const COMMA_KEY_CODE = 188;
const RETURN_KEY_CODE = 13;

const DEFAULT_MIN_TOPIC_LENGTH = 1;

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
  constructor(props, context) {
    super(props, context);
    this.state = {
      pattern: '',
      topics: [],
      selectedSuggestionIndex: -1
    };
  }

  static displayName = 'TopicPicker'

  static propTypes = {
    activeTopics: React.PropTypes.array,
    availableTopics: React.PropTypes.array,
    addMatchEmphasis: React.PropTypes.bool,
    className: React.PropTypes.string,
    handleUpdateTopics: React.PropTypes.func,
    maxSuggestions: React.PropTypes.number,
    minTopicLength: React.PropTypes.number,
  }

  static defaultProps = {
    availableTopics: [],
    activeTopics: [],
    maxSuggestions: 10,
    minTopicLength: DEFAULT_MIN_TOPIC_LENGTH,
    placeholderText: "Add a tag (hit 'return' after each one)",
    // if parent doesn't pass in callback, to avoid conditionals inline
    handleUpdateTopics: () => null,
  }

  componentDidMount() {
    const {activeTopics} = this.props;
    this.setState({topics: activeTopics});
  }

  componentWillReceiveProps(newProps) {
    const {activeTopics} = newProps;
    this.setState({topics: activeTopics});
  }

  _handleKeyDown = (event) => {
    const {selectedSuggestionIndex} = this.state;
    const suggestions = this._filterTopicList();

    if (event.which === DOWN_ARROW_KEY_CODE) {
      this.setState({
        selectedSuggestionIndex: Math.min(
          selectedSuggestionIndex + 1, suggestions.length - 1)});
    }
    else if (event.which === UP_ARROW_KEY_CODE) {
      this.setState({
        selectedSuggestionIndex: Math.max(
          selectedSuggestionIndex - 1, 0)});
    }
    else if (
        (event.which == COMMA_KEY_CODE) ||
        (event.which == RETURN_KEY_CODE)) {
      this._handleTopicSubmit(event);
    }
  }

  /*
   * Move the selected suggestion by `numMoves`
   *
   * Usable in keydown handler for moving selected topic in suggestion list
   */
  _handleMoveSelected = (numMoves) => {
    const {availableTopics} = this.props;
    const {selectedSuggestionIndex} = this.state;
    const newSelectedIndex = selectedSuggestionIndex + numMoves

    if (newSelectedIndex >= -1 && newSelectedIndex < (availableTopics || []).length) {
      this.setState({selectedSuggestionIndex: newSelectedIndex});
    }
  }

  /*
   * Handler for a form change
   */
  _handlePatternChange = (event) => {
    this.setState({pattern: event.target.value})
  }

  /*
   * Return the `availableTopics`, filtered for a matching pattern
   *
   * This makes the topics markdown to add emphasis if the property
   * `addMatchEmphasis` is truthy.
   */
  _filterTopicList = (additionalTopics) => {
    const {topics, pattern} = this.state;
    // in case topic is something like `C++`
    const normalizedPattern = escapeStringRegexp(
      this.state.pattern.toLowerCase());

    const {availableTopics, addMatchEmphasis, maxSuggestions} = this.props;

    // find and mark the pattern matches in a case-insensitive way
    return (availableTopics).
      filter(topic => { // filter for matching available topics
        return topic.toLowerCase().match(normalizedPattern) &&
               topics.indexOf(topic) < 0
      }).
      slice(0, maxSuggestions). // limit the number of results
      map(topic => { // add the asterisks for emphasis around matching area
        if (addMatchEmphasis) {
          const firstIndex = topic.toLowerCase().
            indexOf(topic.toLowerCase().match(normalizedPattern)[0])
          const lastIndex = firstIndex + pattern.length + 1;

          let topicArray = topic.split('');
          topicArray.splice(firstIndex, 0, '*')
          topicArray.splice(lastIndex, 0, '*')
          return topicArray.join('');
        }
        else {
          return topic
        }
      })
  }

  /*
   * Add a topic to the internal list of topics
   */
  _handleAddTopic = (topic) => {
    const {topics} = this.state;
    const {handleUpdateTopics} = this.props;

    if (topics.map(t => t.toLowerCase()).indexOf(topic.toLowerCase()) < 0) {
      // We trim the whitespace off the tag before adding it
      let newTopics = topics.concat(topic.trim());
      this.setState({topics: newTopics});
      handleUpdateTopics(newTopics);
    }

    this.setState({pattern: '', selectedSuggestionIndex: -1});
  }

  /*
   * Remove a topic from the internal list of topics, if it's present
   *
   * Matching is case-sensitive
   */
  _handleRemoveTopic = (topic) => {
    const {topics} = this.state;
    const {handleUpdateTopics} = this.props;

    let newTopics = topics.filter(t => t !== topic);

    this.setState({topics: newTopics});
    handleUpdateTopics(newTopics);
  }

  /*
   * Handle submission of a new topic
   */
  _handleTopicSubmit = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {selectedSuggestionIndex} = this.state;
    let topic;

    if (selectedSuggestionIndex > -1) {
      topic = this._filterTopicList()[selectedSuggestionIndex];
    }
    else {
      topic = this.state.pattern;
    }

    if (topic.trim().length >= this.props.minTopicLength) {
      this._handleAddTopic(topic.trim());
    }
  }

  _toggleFocus = () => {
    this.setState({
      isFocused: !this.state.isFocused
    })
  }

  /*
   * Getter for topics
   */
  getTopics() {
    return this.state.topics;
  }

  render() {
    const {pattern, topics, selectedSuggestionIndex, isFocused} = this.state;
    const {className, placeholderText} = this.props;
    return <div
        className={cx(
          'topic-picker',
          className,
          isFocused && 'topic-picker-focus')}>

      {/* The existing topics */}
      {topics.map((topic, index) => {
        return (
          <Tag
            key={index}
            className='topic'
            displayName={topic}>
            <div
                className="topic-delete-button"
                onClick={(event) => this._handleRemoveTopic(topic)}>
              <Icon name="close"/>
            </div>
          </Tag>
        );
      })}

      <div
          className="topic-form"
          onKeyDown={this._handleKeyDown}
          onSubmit={this._handleTopicSubmit}>
        <input
            onFocus={this._toggleFocus}
            onBlur={this._toggleFocus}
            className="topic-form-input"
            type="text"
            value={pattern}
            placeholder={placeholderText}
            onChange={this._handlePatternChange}/>

        {/* The list of topic suggestions */}
        {pattern && (
          <ul className="topic-suggestion-list">
            {this._filterTopicList().map((topic, index) => {
              return (
                <li
                  key={index}
                  className={cx(
                    'topic-list-item',
                    {selected: index === selectedSuggestionIndex})
                  }
                  onClick={(event) => this._handleAddTopic(
                    topic.replace(/\*/g, ''))
                  }
                  dangerouslySetInnerHTML={{__html: marked(topic)}}/>
              );
            })}
          </ul>
          )
        }
      </div>
    </div>
  }
}

module.exports = {TopicPicker}
