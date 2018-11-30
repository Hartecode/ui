import _ from 'lodash';
import lessToJs from 'less-vars-to-js';

import sgColorsLess from 'tfstyleguide/colors.less';
import sgVarsLess from 'tfstyleguide/vars.less';

module.exports = _.assign(
  {},
  lessToJs(sgVarsLess, {
    resolveVariables: true,
    stripPrefix: true,
  }),
  lessToJs(sgColorsLess, {
    resolveVariables: true,
    stripPrefix: true,
  }),
);
