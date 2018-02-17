const log = require('debug')('ui:analytics');
const omit = require('lodash/object/omit');
const PropTypes = require('prop-types');
const React = require('react');
const TFAnalytics = require('@thinkful/tf-analytics');

/**
 * Usage
 *  <TrackedLink
 *      href="/cats"
 *      label="cat"
 *      category="feline"
 *      data={{hello: "world"}}
 *  />
 *
 *  Produces an analytics event with the following fields:
 *  {
 *      app: "BirdName",
 *      appDisplayName: "ProjectName",
 *      category: "feline",
 *      data: {hello: "world"},
 *      label: "cat",
 *      type: "link"
 *  }
 */
class TrackedLink extends React.Component {
  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(event) {
    const data = omit(
      this.props,
      'children',
      'className',
      'href',
      'onClick',
      'target'
    );
    data.url = this.props.href;

    let eventName = `clicked-${global.__env.config.appDisplayName}-${
      this.props.type
    }`;

    log(eventName, data);
    TFAnalytics.track(eventName, data);

    this.props.onClick && this.props.onClick(event);
  }

  render() {
    const { children, className, href, ...props } = this.props;

    return (
      <a
        className={className}
        href={href}
        onClick={this._handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
}

TrackedLink.propTypes = {
  data: PropTypes.object,
  href: PropTypes.string.isRequired,
  type: PropTypes.string
};

TrackedLink.defaultProps = {
  type: 'link'
};

module.exports = TrackedLink;
