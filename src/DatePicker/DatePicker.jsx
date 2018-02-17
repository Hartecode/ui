const cx = require('classnames');
const _ = require('lodash');
const moment = require('moment-timezone');
const PropTypes = require('prop-types');
const React = require('react');

const Icon = require('../Icon');

// We get the day of the year here to avoid calling for each `Day`
const TODAY = moment();

const Day = ({ date, unclickable, otherMonth, active, onClick }) => {
  const isToday =
    date.year() === TODAY.year() && date.dayOfYear() === TODAY.dayOfYear();

  const classes = cx('day', {
    'other-month': otherMonth,
    active: active,
    today: moment().dayOfYear() === moment(date).dayOfYear(),
    unclickable: unclickable
  });

  return (
    <div className={classes} onClick={onClick}>
      {date.date() === 1 && (
        <div className="day-tiny-text">{date.format('MMM')}</div>
      )}
      {isToday && <div className="day-tiny-text">Today</div>}
      {date.date()}
    </div>
  );
};

Day.propTypes = {
  active: PropTypes.bool,
  date: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  otherMonth: PropTypes.bool,
  unclickable: PropTypes.bool
};

class DatePicker extends React.Component {
  constructor() {
    super();

    this._checkClickAway = this._checkClickAway.bind(this);
    this._generateDays = this._generateDays.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._navigateForward = this._navigateForward.bind(this);
    this._navigateBack = this._navigateBack.bind(this);
    this._toggleOpen = this._toggleOpen.bind(this);

    this.state = {
      activeIndex: null,
      days: [],
      monthsNavigated: 0,
      value: null,
      visible: false
    };
  }

  componentDidMount() {
    this._generateDays(this.props.defaultDate);

    document.addEventListener('click', this._checkClickAway.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._checkClickAway.bind(this));
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.defaultDate.dayOfYear() !== newProps.defaultDate.dayOfYear()
    ) {
      this._generateDays(newProps.defaultDate);
    }
  }

  _checkClickAway(event) {
    // Close the picker if the click wasn't on the dropdown button or calendar
    if (
      this.dropdownButton &&
      !this.dropdownButton.contains(event.target) &&
      (this.calendar && !this.calendar.contains(event.target))
    ) {
      this.setState({ visible: false });
    }
  }

  _generateDays(defaultDate = false) {
    let { monthsNavigated, activeIndex } = this.state;

    // If called on initial render, check defaultDate to determine if calendar
    // should start on a month different than the current one
    if (defaultDate) {
      monthsNavigated = defaultDate.month() - moment().month();
    }

    const startDay = moment()
      .add(monthsNavigated, 'month')
      .startOf('month')
      .startOf('week')
      .startOf('day');
    const endDay = moment()
      .add(monthsNavigated, 'month')
      .endOf('month')
      .endOf('week')
      .startOf('day');
    const totalDays = endDay.diff(startDay, 'days') + 1;

    const days = _.map(Array(totalDays), (i, idx) => ({
      dateObj: moment(startDay).add(idx, 'day'),
      dayOfYear: moment(startDay)
        .add(idx, 'day')
        .dayOfYear()
    }));

    // Keep existing activeIndex if it is defined and a new defaultDate has not come thru
    activeIndex =
      !!defaultDate || !activeIndex || activeIndex === -1
        ? _.findIndex(days, {
            dayOfYear: moment(defaultDate || '').dayOfYear()
          })
        : activeIndex;

    this.setState({
      days: days,
      activeIndex: activeIndex,
      monthsNavigated: monthsNavigated
    });
  }

  _handleClick(event, newDay) {
    const { days } = this.state;
    const { handleChange } = this.props;
    const newActiveIndex = _.findIndex(days, { dayOfYear: newDay });

    this.setState({
      activeIndex: newActiveIndex,
      value: days[newActiveIndex].dateObj
    });
    this._toggleOpen();

    handleChange(days[newActiveIndex].dateObj);
  }

  _navigateForward() {
    this.state.monthsNavigated = this.state.monthsNavigated + 1;
    this._generateDays();
  }

  _navigateBack() {
    this.state.monthsNavigated = this.state.monthsNavigated - 1;
    this._generateDays();
  }

  _toggleOpen() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { className, placeholder } = this.props;
    const { days, activeIndex, monthsNavigated, value, visible } = this.state;

    const activeDay = days[activeIndex] && days[activeIndex].dateObj;
    const datePickerClasses = cx('date-picker', { hidden: !visible });

    return (
      <div className={cx('date-picker-container', className)}>
        <div
          className="button date-picker-button"
          onClick={this._toggleOpen.bind(this)}
          ref={c => (this.dropdownButton = c)}
        >
          {(!value && placeholder) || activeDay.format('MM/DD/YYYY')}
          <Icon name="navigatedown" />
        </div>
        <div className={datePickerClasses} ref={c => (this.calendar = c)}>
          <Icon name="navigateleft" onClick={this._navigateBack.bind(this)} />
          <Icon
            name="navigateright"
            onClick={this._navigateForward.bind(this)}
          />
          <div className="selected-day">
            {moment(activeDay).format('dddd, MMMM Do')}
          </div>
          <div className="day-headings">
            {['S', 'M', 'T', 'W', 'H', 'F', 'S'].map((day, key) => (
              <div key={key} className="day-heading">
                {day}
              </div>
            ))}
          </div>
          <div className="days-container">
            {days.map((day, key) => (
              <Day
                date={day.dateObj}
                key={key}
                active={key === activeIndex}
                otherMonth={
                  day.dateObj.month() !==
                  moment()
                    .add(monthsNavigated, 'month')
                    .month()
                }
                unclickable={false}
                onClick={event => this._handleClick(event, day.dayOfYear)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

DatePicker.defaultProps = {
  className: PropTypes.string,
  defaultDate: PropTypes.object,
  placeholder: PropTypes.string
};

DatePicker.defaultProps = {
  defaultDate: moment()
};

module.exports = DatePicker;
