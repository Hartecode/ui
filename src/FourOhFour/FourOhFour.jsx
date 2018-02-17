const React = require('react');

/**
 * FourOhFour
 *
 * Shared "Not Found" error page for Thinkful SPA's.
 */
class FourOhFour extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.go(-1);
    } else {
      window.location.href =
        window.location.protocol + '//' + window.location.host;
    }
  }

  render() {
    return (
      <div className="tfui-error-page">
        <h1>404</h1>
        <p>
          The page you are looking for couldn't be found.<br /> You can
          try&nbsp;
          <a onClick={this.goBack}>going back</a>.
        </p>
        <div className="tfui-404-cat" />
      </div>
    );
  }
}

module.exports = FourOhFour;
