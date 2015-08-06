const React = require('react');
const cx = require('classnames');

require('./dropdown.less');


/**
 * Shared dropdown menu element
 * @property data {Array} of items to display in the dropdown,
      containing `value` and `displayName`
 * @property selectedInd {Int} of the selected index in the list
 * @property defaultDisplay {String} of default value that should be displayed
 * @property handleChange {Function} to handle dropdown click/change
 */
const Dropdown = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
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
    document.addEventListener('click', (e) => this._checkClickAway(e));
  },

  componentWillUnmount() {
    document.removeEventListener('click', (e) => this._checkClickAway(e));
  },

  _checkClickAway(e) {
    if (!e.target.hasAttribute('data-clickable')) {
      this.setState({open: false});
    }
  },

  _generateNodes() {
    const {data} = this.props;
    return data.map((item, ind) => {
      return (
        <p
          className={cx("dropdown-item", item.className)}
          id={ind}
          key={ind}
          value={item.value}>
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

  componentClickAway() {
    this.setState({open: false});
  },

  render() {
    let {
      initialSelectedInd, selectedInd, data,
      defaultDisplay, className} = this.props;

    selectedInd = selectedInd === undefined ? initialSelectedInd : selectedInd;

    const dropdownClasses = cx(
      'dd-open',
      {'hidden': !this.state.open});

    return (
      <div className={cx("dropdown-container", className)}>
        <div
            className="button button__white dd-button"
            onClick={this._toggleOpen}
            data-clickable>
          {data[selectedInd] && data[selectedInd].displayName || defaultDisplay}
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
