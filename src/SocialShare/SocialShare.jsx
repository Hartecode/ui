const cx = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

/**
  This component can act as a wrapper around anything that should behave as
  a social share link.  Currently supports facebook, twitter and linked in.
 */
class SocialShare extends React.Component {
  _openSocialShareWindow = (width, height, location) => {
    window.open(
      location,
      '',
      `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,` +
        `height=${height},width=${width},left=500`
    );
    return false;
  };

  _coerceFromType = type => {
    const { content, url } = this.props;
    const urlBuilders = {
      twitter: {
        url: `https://twitter.com/home/?status=${content}`,
        width: 600,
        height: 250
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        width: 600,
        height: 300
      },
      linkedin: {
        url: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
        width: 600,
        height: 300
      }
    };

    return urlBuilders[type] || {};
  };

  _handleSocialShareClick = () => {
    const { handleTrackClick, type } = this.props;

    handleTrackClick && handleTrackClick(type);

    const values = this._coerceFromType(type);
    this._openSocialShareWindow(values.width, values.height, values.url);
  };

  render() {
    return (
      <div
        className={cx('social-link-wrapper', this.props.className)}
        onClick={this._handleSocialShareClick}
      >
        {this.props.children}
      </div>
    );
  }
}

SocialShare.propTypes = {
  type: PropTypes.oneOf(['facebook', 'twitter', 'linkedin']),
  handleTrackClick: PropTypes.func
};

module.exports = SocialShare;
