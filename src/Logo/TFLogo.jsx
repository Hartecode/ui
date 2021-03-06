import PropTypes from 'prop-types';
import React from 'react';

const TFLogo = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-44.000000, -86.000000)" fill={color}>
        <g transform="translate(44.000000, 80.000000)">
          <g transform="translate(0.000000, 6.000000)">
            <g>
              <polygon points="0 0.0158656489 0.000559738134 9.17452214 7.56430115 9.17452214 7.56430115 16.9831328 9.92788871 16.9831328 9.92788871 6.85385038 2.36433388 6.85385038 2.36433388 2.33672061 17.34218 2.33672061 17.34218 0.0158656489" />
              <polygon points="22.0494285 3.66412214e-05 22.0494285 6.83783817 14.4855005 6.83783817 14.4855005 21.6027847 7.55892766 21.6027847 7.55892766 23.9236397 16.8492746 23.9236397 16.8492746 9.15869313 24.413016 9.15869313 24.413016 3.66412214e-05" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

TFLogo.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};

TFLogo.defaultProps = {
  color: '#000',
  size: 24,
};

module.exports = TFLogo;
