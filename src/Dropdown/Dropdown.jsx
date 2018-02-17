const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const ReactDOM = require('react-dom');

class Dropdown extends React.Component {
  constructor(props) {
    super();

    this._determineSelectedInd = this._determineSelectedInd.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _determineSelectedInd() {
    const { data, initialSelectedInd, selectedInd, value } = this.props;

    // Case 1: selectedInd or initialSelectedInd provided by props
    if (typeof selectedInd === 'number') {
      return selectedInd;
    }

    if (typeof initialSelectedInd === 'number') {
      return initialSelectedInd;
    }

    // Case 2: get index of `value` from data array
    return _.map(data, item => item.value || item).indexOf(value);
  }

  _handleChange(event) {
    this.props.handleChange(event);
  }

  render() {
    const { className, data, defaultDisplay, htmlId, value } = this.props;

    const selectedInd = this._determineSelectedInd();

    return (
      <div className={cx('tui-dropdown-container', className)}>
        <select
          id={htmlId}
          className="tui-dropdown"
          value={value}
          onChange={this._handleChange}
        >
          {selectedInd == -1 && (
            <option disabled key="tui-dropdown-default" value="">
              {defaultDisplay}
            </option>
          )}
          {data.map((item, idx) => (
            <option
              className={cx(item.className)}
              key={idx}
              value={item.value || item}
            >
              {item.displayName || item}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ).isRequired,
  defaultDisplay: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  htmlId: PropTypes.string,
  initialSelectedInd: PropTypes.number,
  selectedInd: PropTypes.number
};

module.exports = Dropdown;
