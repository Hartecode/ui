const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');

/*
 * Two ways to use it.
 *
 * Render plain, without a close= prop, and it will show up
 * as soon as it is rendered, e.g. in a subroute.
 *
 * Render within a {boolean && <Modal close={handlerFunc} />}
 * to show it conditionally on a user action.
 */
class Modal extends React.Component {
  constructor(props) {
    super(props);

    this._closeModal = this._closeModal.bind(this);

    this.state = {
      controlledByParent: !!props.close,
      isOpen: true
    };
  }

  _closeModal() {
    const { close } = this.props;

    close ? close() : this.setState({ isOpen: false });
  }

  render() {
    const { className } = this.props;
    const { controlledByParent, isOpen } = this.state;

    const modalClasses = cx('tui-modal-content', className);
    const wrapperClasses = cx('tui-modal-wrapper', {
      'tui-modal-wrapper__hidden': !controlledByParent && !isOpen
    });

    return (
      <div className={wrapperClasses}>
        <div className="tui-modal-curtain" onClick={this._closeModal} />
        <div className={modalClasses}>
          <a className="tui-modal-close-button" onClick={this._closeModal}>
            <Icon name="close" />
          </a>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  className: PropTypes.string,
  close: PropTypes.func
};

module.exports = Modal;
