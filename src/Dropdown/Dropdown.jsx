const cx = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

require('./dropdown.less');


/**
 * Shared dropdown menu element
 * @property data {Array} of items to display in the dropdown,
      containing `value` and `displayName`, or strings
 * @property selectedInd {Int} of the selected index in the list
 * @property defaultDisplay {String} of default value that should be displayed
 * @property handleChange {Function} to handle dropdown click/change
 */
const Dropdown = React.createClass({

  propTypes: {
    data: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ])).isRequired,
    initialSelectedInd: React.PropTypes.number,
    selectedInd: React.PropTypes.number,
    defaultDisplay: React.PropTypes.string,
    handleChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  getDefaultProps() {
    return {data: []};
  },

  componentDidMount() {
    document.addEventListener('click', this._checkClickAway);
  },

  componentWillUnmount() {
    document.removeEventListener('click', this._checkClickAway);
  },

  _checkClickAway(e) {
    if (!ReactDOM.findDOMNode(this.dropdownButton).contains(e.target)) {
      this.setState({open: false});
    }
  },

  _generateNodes() {
    let {data} = this.props;

    // Translate `data` from an array of strings, if necessary.
    data = data.map(item => {
      return {
        value: _.has(item, 'value') ? item.value : item,
        displayName: _.has(item, 'displayName') ? item.displayName : item,
        className: item.className,
      }
    });

    return data.map((item, ind) => {
      return (
        <p
            className={cx("dropdown-item", item.className)}
            id={ind}
            value={item.value}
            key={ind}>
          {item.displayName}
        </p>
      );
    });
  },

  _toggleOpen() {
    this.setState({open: !this.state.open});
  },

  _handleChange(event) {
    let {handleChange} = this.props;
    this._toggleOpen();
    handleChange(event);
  },

  _determineSelectedInd() {
    const { data, initialSelectedInd, selectedInd, value } = this.props;

    // Case 1: selectedInd or initialSelectedInd provided by props
    if (typeof(selectedInd) === 'number') {
      return selectedInd;
    }

    if (typeof(initialSelectedInd) === 'number') {
      return initialSelectedInd;
    }

    // Case 2: get index of `value` from data array
    return _.map(data, item => item.value || item).indexOf(value)
  },

  _getDisplayText() {
    const { data, defaultDisplay } = this.props;
    const selectedInd = this._determineSelectedInd();

    if (selectedInd === -1) {
      return defaultDisplay;
    }

    return _.map(data,
      item => item.displayName || item)[selectedInd] || defaultDisplay;
  },

  render() {
    const { className } = this.props;

    const dropdownClasses = cx(
      'dd-open',
      {hidden: !this.state.open});

    return (
      <div className={cx("dropdown-container", className)}>
        <div
            className="button dd-button"
            onClick={this._toggleOpen}
            ref={c => this.dropdownButton = c}
            data-clickable>
          <span className="dropdown-text">
            {this._getDisplayText()}
          </span>
          <span className="icon-navigatedown" aria-hidden="true"></span>
        </div>
        <div
          className={dropdownClasses}
          onClick={this._handleChange}>
          {this._generateNodes()}
        </div>
      </div>
    );
  }
});

module.exports = Dropdown;
