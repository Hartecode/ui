const React = require('react');
const Demo = require('react-demo');
const moment = require('moment-timezone');

const {
  Gravatar,
  Icon,
  Dropdown,
  DatePicker,
  AvailabilityGrid,
  Loader
} = require('../src')

require('./styles/demo.less')

class DemoPage extends React.Component {
  render() {
    const sampleDropdownData = [
      { value: 'pizza', displayName: "Tasty Pizza"},
      { value: 'waffles', displayName: "Delicious Waffles"},
      { value: 'felafel', displayName: "I'm feelin Falafel"},
      { value: 'bose', displayName: "No highs no lows, must be Bose"}
    ];

    return (<div className="tui-demo-page">
      <h1>Thinkful UI</h1>
      <h3>Gravatar</h3>
      <Demo
        target={Gravatar}
        props={{
          email: Demo.props.string('tholex@gmail.com'),
          size: Demo.props.choices([60,120])
        }} />

      <h3>Icon</h3>
      <Demo
        target={Icon}
        props={{
          name: Demo.props.string('pointupright'),
          className: Demo.props.string('additional-class')
        }} />

      <h3>Dropdown</h3>
      <Demo
        target={Dropdown}
        props={{
          data: Demo.props.constant(sampleDropdownData),
          initialSelectedInd: Demo.props.choices([undefined,0,1,2]),
          defaultDisplay: Demo.props.string("Choose something awesome"),
          handleChange: Demo.props.callback.log(e => e.target.getAttribute('value'))
        }} />

      <h3>DatePicker</h3>
      <Demo
        target={DatePicker}
        props={{
          defaultDate: Demo.props.constant(moment()),
          className: Demo.props.choices(['additional-class', '']),
          handleChange: Demo.props.callback.log(date => moment(date).format('YYYY-MM-DD'))
        }} />

      <h3>AvailabilityGrid</h3>
      <Demo
        target={AvailabilityGrid}
        props={{
          bitmap: Demo.props.string("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111110000000000001111111100000000000000000000000000000000000000000000000000000000000000000000111111110000000000001111111100000000000000000000000000000000000000000000000000000000000000000000111111110000000000001111111100000000000000000000000000000000000000000000000000000000000000000000111111110000000000001111111100000000000000000000000000000000000000000000000000000000000000000000111111110000000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"),
          slotsHour: Demo.props.constant(1),
          maxHour: Demo.props.constant(24),
          minHour: Demo.props.constant(0),
          disabled: Demo.props.choices([false, true])
        }} />

      <h3>Loader</h3>
      <Demo
        target={Loader}
        props={{
          className: Demo.props.constant('additional-class')
        }} />
    </div>);
  }
}

module.exports = {DemoPage};
