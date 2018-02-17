const AvatarEditor = require('react-avatar-editor');
const cx = require('classnames');
const md5 = require('md5');
const noCache = require('superagent-no-cache');
const PropTypes = require('prop-types');
const React = require('react');
const request = require('superagent');

class AvatarUploader extends React.Component {
  constructor(props) {
    super(props);

    this._initialState = this._initialState.bind(this);
    this._userGravatarUrl = this._userGravatarUrl.bind(this);
    this._handleImageUrlChange = this._handleImageUrlChange.bind(this);
    this._handleClearAvatar = this._handleClearAvatar.bind(this);
    this._isOnMobile = this._isOnMobile.bind(this);

    this.getValue = this.getValue.bind(this);

    this.state = {
      default: this._initialState(),
      ...this._initialState(),
      loading: true,
      pristine: true
    };
  }

  componentDidMount() {
    const { isGravatar, imageUrl } = this.state.default;

    if (isGravatar) {
      this.setState({ loading: false });
    } else {
      // Image gets requested without an origin and s3 throws a CORS error.
      // Request the image with superagent and convert to a data uri manually
      // to prevent this.
      request.parse['img/png'] = function(obj) {
        return obj;
      };
      request
        .get(imageUrl)
        .use(noCache)
        .withCredentials()
        .on('request', function() {
          this.xhr.responseType = 'arraybuffer';
        })
        .end((err, response) => {
          if (err) {
            console.log(err);
            return;
          }
          var buf = new Buffer(response.xhr.response, 'binary');
          var b = buf.toString('base64');
          this.setState({
            loading: false,
            imageUrl: 'data:image/png;base64,' + b
          });
        });
    }
  }

  _initialState() {
    return {
      imageUrl: this.props.imageUrl,
      isGravatar: /gravatar.com\/avatar/.test(this.props.imageUrl)
    };
  }

  _userGravatarUrl() {
    return `https://www.gravatar.com/avatar/${md5(
      this.props.email
    )}?d=retro&s=90`;
  }

  _handleImageUrlChange() {
    this.setState(
      {
        imageUrl: this.editor.getImage(),
        isGravatar: false,
        pristine: false
      },
      this.props.onChange
    );
  }

  _handleClearAvatar() {
    this.editor.loadImage(this._userGravatarUrl());
    this.setState(
      {
        imageUrl: this._userGravatarUrl(),
        isGravatar: true,
        pristine: false
      },
      this.props.onChange
    );
  }

  _isOnMobile() {
    // Smart phones have an orientation property. Use that to detect mobile
    return typeof window.orientation !== 'undefined';
  }

  getValue() {
    return this.state.isGravatar
      ? ''
      : this.state.pristine
        ? this.state.default.imageUrl
        : this.editor.getImage();
  }

  render() {
    const { imageUrl } = this.props;
    const { isGravatar, loading } = this.state;

    return (
      <div className="avatar-uploader">
        {!loading && (
          <AvatarEditor
            border={0}
            height={90}
            image={imageUrl}
            onDropFile={this._handleImageUrlChange}
            ref={c => (this.editor = c)}
            width={90}
          />
        )}
        <div className="avatar-copy">
          {this._isOnMobile() ? (
            <p>
              Visit this page from a desktop computer to update your
              avatar.&nbsp; Your photo will fall back to one from{' '}
              <a href="https://www.gravatar.com" target="_blank">
                Gravatar
              </a>{' '}
              if none is added.
            </p>
          ) : (
            <div>
              <p>
                Drag and drop an image to update your avatar. Your photo will
                fall&nbsp; back to one from{' '}
                <a href="https://www.gravatar.com" target="_blank">
                  Gravatar
                </a>{' '}
                if none is added.
              </p>
              <a
                className={cx({ link__disabled: isGravatar })}
                onClick={this._handleClearAvatar}
              >
                Clear image
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

AvatarUploader.propTypes = {
  imageUrl: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  email: PropTypes.string
};

module.exports = AvatarUploader;
