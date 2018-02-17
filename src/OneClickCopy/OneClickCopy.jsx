const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

class OneClickCopy extends React.Component {
  _handleInputClick = event => {
    event.preventDefault();
    this.inputElement.select();
  };

  _handleCopyToClipboard = event => {
    const { onCopyClick, onCopyClickSuccess, onCopyClickFail } = this.props;
    event.preventDefault();

    this.inputElement.select();
    onCopyClick();

    try {
      const successful = document.execCommand('copy');
      successful ? onCopyClickSuccess() : onCopyClickFail();
    } catch (error) {
      onCopyClickFail();
    }
  };

  render() {
    const { className, copyButtonText, inputText } = this.props;

    return (
      <div className={cx('one-click-copy', className)}>
        <input
          className="copy-area"
          onFocus={this._handleInputClick}
          ref={ref => (this.inputElement = ref)}
          type="text"
          value={inputText}
          readOnly
        />
        <div
          className="button copy-button"
          onClick={this._handleCopyToClipboard}
        >
          {copyButtonText}
        </div>
      </div>
    );
  }
}

OneClickCopy.propTypes = {
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  copyButtonText: PropTypes.string,
  inputText: PropTypes.string,
  onCopyClick: PropTypes.func,
  onCopyClickSuccess: PropTypes.func,
  onCopyClickFail: PropTypes.func
};

OneClickCopy.defaultProps = {
  copyButtonText: 'Copy'
};

module.exports = OneClickCopy;
