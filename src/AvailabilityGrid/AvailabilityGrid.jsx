require('./availability_grid.less');

const React = require('react');
const classNames = require('classnames');
const moment = require('moment');
const chunk = require('lodash/array/chunk');
const difference = require('lodash/array/difference');
const fill = require('lodash/array/fill');

const { Icon } = require('../Icon');

const log = require('debug')('ui:AvailabilityGrid');

const DESKTOP_GRID_WIDTH = 620;

const AvailabilityGridSlot = React.createClass({
  propTypes: {
    dayIndex: React.PropTypes.number.isRequired,
    mouseDown: React.PropTypes.number.isRequired,
    selectionMode: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired,
    onSelectionModeChanged: React.PropTypes.func.isRequired,
    onSlotUnselected: React.PropTypes.func.isRequired,
    onSlotSelected: React.PropTypes.func.isRequired,
    mobile: React.PropTypes.bool,
  },

  handleMouseDown() {
    const {data, dayIndex, onSelectionModeChanged, onSlotUnselected, onSlotSelected} = this.props;

    if (this.props.data.selected) {
      onSelectionModeChanged('unselecting', dayIndex, data.index);
      onSlotUnselected(dayIndex, data.index);
    } else {
      onSelectionModeChanged('selecting', dayIndex, data.index);
      onSlotSelected(dayIndex, data.index);
    }
  },

  handleMouseUp() {
    this.props.onSelectionModeChanged('neutral');
  },

  handleMouseEnter() {
    const {data, mouseDown, dayIndex, selectionMode, onSlotSelected, onSlotUnselected} = this.props;

    if (mouseDown === 1) {
      if (selectionMode === 'selecting') {
        onSlotSelected(dayIndex, data.index);
      } else if (selectionMode === 'unselecting') {
        onSlotUnselected(dayIndex, data.index);
      }
    }
  },

  render() {
    let classes = classNames(
      'availability-grid-slot',
      {'selected': this.props.data.selected}
    );

    return (
      <div
          className={classes}
          onMouseEnter={this.handleMouseEnter}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp} >
        {this.props.mobile && this.props.data.name}
      </div>
    );
  }
})

const AvailabilityGridDay = React.createClass({
  propTypes: {
    minSlot: React.PropTypes.number.isRequired,
    maxSlot: React.PropTypes.number.isRequired,
    data: React.PropTypes.object.isRequired,
    onNavigateDay: React.PropTypes.func,
    isMinDay: React.PropTypes.bool,
    isMaxDay: React.PropTypes.bool,
  },

  render() {
    let slotNodes = this.props.data.slots.map((slotData, index) => {
      const {data, ...other} = this.props;
      return (
        <AvailabilityGridSlot
            key={index}
            data={slotData}
            dayIndex={data.index}
            {...other} />
      );
    })

    return (
      <div className="availability-grid-day">
        <span className="availability-grid-day-name">
          {this.props.mobile &&
            <Icon
                className={classNames(
                  "navigation navigation__left",
                  {disabled: this.props.isMinDay})}
                name="navigateleft"
                onClick={e => this.props.onNavigateDay(-1)}/>}
          {this.props.data.name}
          {this.props.mobile &&
            <Icon
                className={classNames(
                  "navigation navigation__right",
                  {disabled: this.props.isMaxDay})}
                name="navigateright"
                onClick={e => this.props.onNavigateDay(1)}/>}
        </span>
        <div className="availability-grid-items">
          {slotNodes.slice(this.props.minSlot, this.props.maxSlot)}
        </div>
      </div>
    );
  }
})

const AvailabilityGrid = React.createClass({
  propTypes: {
    slotsHour: React.PropTypes.number.isRequired,
    minHour: React.PropTypes.number.isRequired,
    maxHour: React.PropTypes.number.isRequired,
    onPost: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    mobile: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      onChange: () => {},
    }
  },

  getInitialState() {
    let days;
    if (this.shouldRenderMobile()) {
      days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ];
    }
    else {
      days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    }

    const HOURS_DAY = 24;
    const MINUTES_HOUR = 60;
    const MINUTES_SLOT = MINUTES_HOUR / this.props.slotsHour;
    const SLOTS_DAY = HOURS_DAY * this.props.slotsHour;

    let daysData = [];
    let slotNames = [];
    let selectionMode = 'neutral';


    // precalculate the slot names one time
    let formatString = 'h a';
    if (this.props.slotsHour > 1) {
      formatString = 'h:mma';
    }

    let currentSlot = moment().startOf('day');
    for (let i = 0; i < SLOTS_DAY; i++) {
      slotNames.push(currentSlot.format(formatString));
      currentSlot.add(MINUTES_SLOT, 'm');
    }

    daysData = days.map((name, index) => {
      let slots = slotNames.map((name, index) => ({name, index, selected: false}));

      return {index, name, slots};
    });

    return {
      activeDayIdx: 0,
      days: daysData,
      slotNames: slotNames,
      selectionMode: selectionMode,
      selectionStartDays: _.cloneDeep(daysData),
      selectionStartDay: 0,
      selectionStartSlot: 0,
      mouseDown: 0
    };
  },

  onMouseDown(e) {
    this.setState({mouseDown: this.state.mouseDown + 1});
  },

  onMouseUp(e) {
    this.setState({mouseDown: this.state.mouseDown - 1});
  },

  componentWillReceiveProps(nextProps) {
    this._digestBitmap(nextProps.bitmap);
  },

  componentDidMount() {
     // If the bitmap is present when the component is mounted, render it.
     if (this.props.bitmap && this.props.bitmap != '') {
       this._digestBitmap(this.props.bitmap);
     }
   },

  /**
   * Translates bitmapstring to internal data structures and stores it on
   * the state.
   *
   * Bitmap for availability is a string of 1s and 0s, with 1 representing
   * an avalible time block and 0 representing an unavailible time block.
   *
   * Totally free: 11111111111111111111
   * Always busy:  00000000000000000000
   *
   * If there are 4 slots in every hour (15 minutes per time block), then
   * the availability bitmap of someone busy for the first 30m of each hour
   * would look like this: 00110011001100110011
   *
   * This function splits the bitstring into the days variable we store on
   * state.
   *
   */
  _digestBitmap(bitmap='') {
    const MAX_SLOTS_HOUR = 4;
    const HOURS_DAY = 24;
    const DAYS_SLOT = MAX_SLOTS_HOUR * HOURS_DAY;
    const BITS_SLOT = MAX_SLOTS_HOUR / this.props.slotsHour;
    const AVAILABLE_BITMAP = fill(Array(BITS_SLOT), '1')

    bitmap = bitmap.split('');

    chunk(bitmap, DAYS_SLOT).
      map((day, dayIndex) => chunk(day, BITS_SLOT).
        map((slot, slotIndex) => {
          this.state.days[dayIndex].slots[slotIndex].selected =
            difference(slot, AVAILABLE_BITMAP).length === 0;
        })
      )
    ;

    this.setState({days: this.state.days});
  },

  getBitmap() {
    // translate state to bitmap and return
    return this.state.days.map((dayData) => {
      return dayData.slots.map((slot) => {
        let value = slot.selected ? '1' : '0'
        return new Array(4 / this.props.slotsHour + 1).join(value);
      }).join('');
    }).join('');
  },

  getNumDaysSelected() {
    return this.state.days.reduce((prev, day) => {
      return prev + !!_.find(day.slots, 'selected') * 1;
    }, 0);
  },

  getNumHoursSelected() {
    return this.getBitmap().replace(/0/g, '').length / 4;
  },

  getSlotsAvailable() {
    return _.sum(this.state.days.map(dayData => {
      return _.sum(dayData.slots.map(slot => {
        return slot.selected ? 1 : 0
      }));
    }));
  },

  handleMouseEnter() {
    if (this.state.mouseDown === 0) {
      this.handleSelectionModeChanged('neutral');
    }
  },

  handlePost() {
    this.props.onPost(this.getBitmap());
  },

  handleSelectionModeChanged(newMode, startDay, startSlot) {
    if (!this.props.disabled) {
      if (newMode == 'selecting' || newMode == 'unselecting') {
        let days = this.state.days;
        days[startDay].slots[startSlot].selected = (newMode === 'selecting')

        this.setState({
          days: days,
          selectionStartDays: _.cloneDeep(days),
          selectionMode: newMode,
          selectionStartDay: startDay,
          selectionStartSlot: startSlot
        });
      } else {
        this.setState({
          selectionMode: newMode
        });
      }
    }
  },

  handleSlotSelected(dayIndex, slotIndex) {
    this.handleSlot(dayIndex, slotIndex, true);
  },

  handleSlotUnselected(dayIndex, slotIndex) {
    this.handleSlot(dayIndex, slotIndex, false);
  },

  handleSlot(dayIndex, slotIndex, value) {
    if (this.state.selectionMode === 'selecting' || this.state.selectionMode === 'unselecting') {
      let days = this.state.days;

      let startDay = Math.min(this.state.selectionStartDay, dayIndex)
      let endDay = Math.max(this.state.selectionStartDay, dayIndex)

      let startSlot = Math.min(this.state.selectionStartSlot, slotIndex)
      let endSlot = Math.max(this.state.selectionStartSlot, slotIndex)

      days.map((day, i) => {
        day.slots.map((slot, j) => {
          if (i >= startDay && i <= endDay && j >= startSlot && j <= endSlot) {
            days[i].slots[j].selected = value;
          } else {
            days[i].slots[j].selected = this.state.selectionStartDays[i].slots[j].selected;
          }
        })
      });

      this.setState({days: days}, this.props.onChange(days));
    }
    else {
      this.props.onChange(this.state.days);
    }
  },

  shouldRenderMobile() {
    return window.innerWidth < DESKTOP_GRID_WIDTH;
  },

  handleNavigateDay(direction) {
    let newIdx = this.state.activeDayIdx + direction;
    newIdx = Math.max(Math.min(newIdx, this.state.days.length - 1), 0);
    this.setState({activeDayIdx: newIdx});
  },

  render() {
    let slotNames = this.state.slotNames.map((slotName, index) => {
      return (
        <div className="availability-grid-slot-name" key={index}>
          {slotName}
        </div>
      );
    })

    let minSlot = this.props.minHour * this.props.slotsHour;
    let maxSlot = this.props.maxHour * this.props.slotsHour;

    let days;
    if (this.shouldRenderMobile()) {
      days = [this.state.days[this.state.activeDayIdx]];
    }
    else {
      days = this.state.days;
    }

    let dayNodes = days.map((dayData, index) => {
      return (
        <AvailabilityGridDay
            key={index}
            data={dayData}
            isMaxDay={this.state.activeDayIdx >= this.state.days.length - 1}
            isMinDay={this.state.activeDayIdx <= 0}
            minSlot={minSlot}
            maxSlot={maxSlot}
            mobile={this.shouldRenderMobile()}
            mouseDown={this.state.mouseDown}
            onSelectionModeChanged={this.handleSelectionModeChanged}
            onSlotSelected={this.handleSlotSelected}
            onSlotUnselected={this.handleSlotUnselected}
            onNavigateDay={this.handleNavigateDay}
            selectionMode={this.state.selectionMode} />
      );
    });

    let classes = classNames(
      'availability-grid', {
        'availability-grid__disabled': this.props.disabled,
        'availability-grid__mobile': this.shouldRenderMobile()
      }
    );

    return (
      <div
          className={classes}
          onMouseEnter={this.handleMouseEnter}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp} >
        {!this.shouldRenderMobile() &&
          <div
              className="availability-grid-slot-names">
            {slotNames.slice(minSlot, maxSlot)}
          </div>
        }
        <div
            className="availability-grid-days">
          {dayNodes}
        </div>
        {this.props.onPost && (
          <input
              className="button"
              type="submit"
              onClick={this.handlePost}
              value="Update Availability"/>
          )}
      </div>
    );
  }
})

module.exports = AvailabilityGrid;
