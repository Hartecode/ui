const React = require('react');
const ReactDOM = require('react-dom');
const { Router, browserHistory } = require('react-router');

const { routes } = require('./routes');

require('tfstyleguide/core.less');

/*
   Index for the Thinkful UI Demo Page
*/
ReactDOM.render(
  <Router history={browserHistory} routes={routes} {...global.__env} />,
  global.document.getElementById('tui-demo-app'));
