const React = require('react');
const Demo = require('react-demo');
const moment = require('moment-timezone');

const {
  AvailabilityGrid,
  DatePicker,
  Dropdown,
  Footer,
  Gravatar,
  Icon,
  Loader,
  NotificationView,
  OpenSessionOverview,
  TopicPicker,
} = require('../src')

require('./styles/demo.less')

class DemoPage extends React.Component {
  render() {
    const sampleDropdownData = [
      { value: 'pizza', displayName: "Tasty Pizza"},
      { value: 'waffles', displayName: "Delicious Waffles"},
      { value: 'falafel', displayName: "I'm feelin Falafel"},
      { value: 'bose', displayName: "No highs no lows, must be Bose"}
    ];

    const sampleNotifications = [
      {
        id: "9fc56050-61a1-11e5-8080-8001719413bb",
        message: "Have opinions? Take our satisfaction survey!",
        time: "2015-09-23T03:17:30.280968",
        is_seen: false,
        is_read: false
      },
      {
        id: "9fc56050-61a1-11e5-8080-8001719413bb",
        message: "How did you like the workshop \"The great CSS Bake-off 2016\"?",
        votable: true,
        votable_url: "https://thinkful.typeform.com/to/bIbY9x?&session=The%20great%20CSS%20Bake-off%202016&source=testing&sid=23&cid=23&rating=",
        time: "2015-09-21T03:17:30.280968",
        is_seen: false,
        is_read: false
      },
      {
        id: "9fc56050-61a1-11e5-8080-8001719413bb",
        message: "Have opinions? Take our satisfaction survey!",
        time: "2015-09-21T03:17:30.280968",
        is_seen: false,
        is_read: false
      },
      {

        id: "9fc56050-61a1-11e5-8080-8001719413bb",
        message: "Have opinions? Take our satisfaction survey!",
        time: "2015-09-23T03:17:30.280968",
        is_seen: true,
        is_read: true
      }
    ]
    const sampleUnseenCount = 3;

    return (
      <div className="tui-demo-page-container">
        <div className="tui-demo-page">
          <h1>Thinkful UI</h1>

          <h3>NotificationView</h3>
          <div style={{
            'position': 'relative',
            'height': '46px'
          }}>
            <NotificationView
              notifications={sampleNotifications}
              unseenCount={sampleUnseenCount} />
          </div>

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
              handleChange: Demo.props.callback.log(e => e.target.value)
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
              className: Demo.props.constant("additional-class"),
              height: Demo.props.choices(['60px', '180px', '50vh'])
            }} />

          <h3>OpenSessionOverview</h3>
          <Demo
            target={OpenSessionOverview}
            props={{
              session: Demo.props.json({
                background_image_url: 'https://s3-us-west-2.amazonaws.com/sourcegraph-assets/blog/einstein_code.jpeg',
                description: 'Git is the most popular versioning control software and is essential for any developer\'s workflow. We\'ll discuss basic git commands, the GitHub interface, and how to host your website on GitHub pages for free.',
                endDtLocal: (e => moment().add(1, 'h').endOf('h')),
                host: {
                  name: 'Elon Musk',
                  image_url: 'https://pbs.twimg.com/profile_images/378800000305778238/852d2f76797dbe1da82095f988d38fbe_400x400.png'
                },
                isHappeningNow: (e => {return false}),
                isPast: (e => {return false}),
                isStartingSoon: (e => {return false}),
                isWorkshop: (e => {return true}),
                startDtLocal: (e => moment().add(1, 'h').startOf('h')),
                tags: ['React', 'demo', 'github', 'all of the tags'],
                title: 'Intro to GitHub'
              }),
              config: Demo.props.json({projects: {url: ''}})
            }}/>

            <h3>TopicPicker</h3>
            <Demo
              target={TopicPicker}
              props={{
                activeTopics: Demo.props.json(['foo', 'bar']),
                addMatchEmphasis: Demo.props.bool(true),
                availableTopics: Demo.props.json(
                  ['HTML', 'hockey', 'horses', 'hypervisor']),
                handleUpdateTopics: Demo.props.callback.log,
                maxSuggestions: Demo.props.choices([2, 3, 4]),
                minTopicLength: 3,
              }}/>
          {this.props.children}
        </div>
        <Footer user={{timezone: 'America/New_York'}} />
      </div>);
  }
}

module.exports = {DemoPage};
