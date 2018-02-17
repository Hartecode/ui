const React = require('react');

// NOTE: You must import standalone.less from the lib root

const AppBar = require('./Navigation');

module.exports = {
  AppBar,
  mount() {
    let mountElement = document.getElementById('TUI-AppBar');

    if (!mountElement) {
      mountElement = document.createElement('div');
      mountElement.id = 'TUI-AppBar';
      document.body.insertBefore(mountElement, document.body.firstChild);
    }

    React.render(React.createElement(AppBar, global.__env), mountElement);
  }
};
