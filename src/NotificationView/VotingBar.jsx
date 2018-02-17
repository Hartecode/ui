const PropTypes = require('prop-types');
const React = require('react');

const starArray = [5, 4, 3, 2, 1];

const VotingStar = ({ href }) => (
  <a className="tui-voting-star" href={href}>
    <svg
      width="30px"
      height="30px"
      viewBox="0 0 30 30"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#6599FF" strokeWidth="2" fill="#FFFFFF" fillrule="evenodd">
        <path d="M2.78,12.18 L11.71,12.18 L15,3.25 L18.29,12.18 L27.22,12.18 L20.4999993,17.8604765 L23.46,26.75 L15.0000003,21 L6.54,26.75 L9.49999979,17.8604765 L2.78,12.18 Z" />
      </g>
    </svg>
  </a>
);

VotingStar.propTypes = {
  href: PropTypes.string.isRequired
};

const VotingBar = ({ url }) => (
  <div className="tui-notification-voting-bar">
    {starArray.map(num => <VotingStar href={url + num.toString()} />)}
  </div>
);

VotingBar.propTypes = {
  url: PropTypes.string.isRequired
};

module.exports = VotingBar;
