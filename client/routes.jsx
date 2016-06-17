const React = require('react');
const Router = require('react-router');
const {IndexRoute, Route} = Router;
const {DemoPage} = require('./DemoPage');
const {HomePage} = require('./HomePage');
const {StaticModalPage} = require('./StaticModalPage');

const {
  FourOhFour,
  AppBar
} = require('./../src');

const USER = global.__env ? global.__env.user : null;
const CONFIG = global.__env ? global.__env.config : null;

class App extends React.Component {
  render() {
    return <div>
      <AppBar user={USER} config={CONFIG}/>
      {this.props.children}
    </div>;
  }
}

const routes = (
  <Route path="/" component={App}>
    <Route path="demo" component={DemoPage}>
      <Route path="modal" component={StaticModalPage} />
    </Route>
    <IndexRoute component={HomePage} />
    <Route path="*" component={FourOhFour}/>
  </Route>
);


module.exports = {routes};
