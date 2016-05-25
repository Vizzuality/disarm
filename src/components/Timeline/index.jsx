'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import moment from 'moment';

import utils from '../../scripts/helpers/utils';
import './styles.postcss';

const defaults = {
  domain: [new Date(Date.UTC(2012, 0, 1)), new Date(Date.UTC(2012, 11, 1))],
  svgPadding: {
    top: 0,
    right: 15,
    bottom: 0,
    left: 15
  },
  cursor: {
    speed: 100 /* seconds per month */
  },
  ticksAtExtremities: false
};

/* README FIRST! <3
  if you need to use moment() at anytime, please
  don't forget to add UTC timezone using moment.utc()

  You will avoid lots of problems and headaches. \o/
*/

class TimelineView extends Backbone.View {

  events() {
    return {
      'click .js-button': 'togglePlay'
    };
  }

  initialize(options) {
    this.options = _.extend(defaults, options);

    /* Cache */
    this.svgContainer = this.el.querySelector('.js-svg-container');
    this.button = this.el.querySelector('.js-button');
    this.buttonIcon = this.el.querySelector('.js-button-icon');

    /* Position of the cursor
     * NOTE: doesn't contain a position in pixels but a date */
    if(this.options.cursorPosition) {
      this.cursorPosition = this.options.cursorPosition;
    } else {
      this.cursorPosition = this.options.domain[this.options.domain.length - 1];
    }

    this.render();
    this.setListeners();
  }

  setListeners() {
    $(window).resize(_.debounce(this.render, 50).bind(this));
  }

  render() {
    const smallScreen = utils.checkDevice().mobile ||
      utils.checkDevice().tablet;

    const svgContainerDimensions = this.svgContainer.getBoundingClientRect();

    const svgPadding = Object.assign({}, this.options.svgPadding);

    /* When we have ticks at the extremities (whose format is longer), we add
     * more padding */
    if(this.options.ticksAtExtremities) {
      svgPadding.left  += 15;
      svgPadding.right += 15;
    }

    const svgWidth = svgContainerDimensions.width - svgPadding.left
      - svgPadding.right;
    const svgHeight = svgContainerDimensions.height - svgPadding.top
      - svgPadding.bottom;

    /* Because d3 doesn't display the first tick, we subtract 1 day to it.
     * NOTE: concat and clone are used to not modify the original array */
    const domain = this.options.domain.concat([]);
    // domain[0] = moment.utc(domain[0]).clone().subtract(1, 'days').toDate();

    // to display last tick (december), we add 1 day to it.
    domain[1] = moment.utc(domain[1]).clone().add(1, 'days').toDate();

    this.scale = d3.time.scale.utc()
      .domain(domain)
      .range([0, svgWidth]);

    /* List of the dates for which we want ticks */
    let ticksDates = d3.time.month.utc.range(domain[0], domain[1], 1);

    if(this.options.ticksAtExtremities) {
      ticksDates = ticksDates.concat(domain)
        .sort((a, b) => (+a) - (+b)); /* Compulsory */
    }

    this.axis = d3.svg.axis()
      .scale(this.scale)
      .orient('top')
      /* TODO: should accept non yearly domains */
      .tickValues(ticksDates)
      .tickFormat((d, i) => {

        /* The ticks at the extremities are the whole date and not just the
         * year */
        // if(this.options.ticksAtExtremities) {
        //   if(i === 0 || i === ticksDates.length - 1) {
        //     return moment.utc(d).format('MM·DD·YYYY');
        //   }
        //   return;
        // }

        return moment.utc(d).month(i).format('MMM');
      })
      .outerTickSize(0);

    this.svgContainer.innerHTML = '';

    this.svg = d3.select(this.svgContainer)
      .append('svg')
        .attr('width', svgContainerDimensions.width)
        .attr('height', svgContainerDimensions.height)
        .append('g')
          .attr('transform', `translate(${svgPadding.left}, ${svgPadding.top})`);

    this.d3Axis = this.svg
        .append('g')
          .attr('class', 'axis')
          .style('stroke-dasharray', '6, 6')
          .attr('transform', 'translate(0, ' + (svgContainerDimensions.height / 2 + 4) + ')')
          .call(this.axis);

    /* We need it to calculate the position of the brush */
    this.axis = this.d3Axis[0][0];

    this.brush = d3.svg.brush()
      .x(this.scale)
      .extent([this.options.domain[1], this.options.domain[1]])
      .clamp(true)
      .on('brushstart', this.onCursorStartDrag.bind(this))
      .on('brush', this.onCursorDrag.bind(this))
      .on('brushend', this.onCursorEndDrag.bind(this));

    /* Cursor line - needs to be under the ticks */
    this.d3CursorLine = this.d3Axis
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.scale(this.cursorPosition))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke-dasharray', 'none')
      .attr('class', 'cursor-line');

    /* We add the ticks for the report */
    this.d3Axis.selectAll('.tick')
      .append('rect')
      .attr('width', smallScreen ? 5 : 6)
      .attr('height', smallScreen ? 5 : 6)
      .attr('x', smallScreen ? -2.5 : -3)
      .attr('y', smallScreen ? -2.5 : -3)
      .attr('transform', 'rotate(45)')
      .attr('class', 'report');

    /* We slightly move the ticks' text to the top and center it */
    this.d3Axis.selectAll('.tick text')
      .attr('y', smallScreen ? -11 : -15)
      .style('text-anchor', 'middle');

    /* We add the cursor */
    const d3Slider = this.d3Axis
      .append('g')
      .attr('class', 'slider')
      .call(this.brush);

    d3Slider.selectAll('.extent, .resize, .background')
      .remove();

    this.d3Cursor = d3Slider
      .attr('transform', () => `translate(${this.scale(this.cursorPosition)})`);

    /* We add the blurred shadow of the cursor */
    this.svg
      .append('defs')
        .append('filter')
        .attr('id', 'cursorShadow')
          .append('feGaussianBlur')
          .attr('stdDeviation', !~navigator.userAgent.toLowerCase().indexOf('firefox') ? 2 : 1);

    this.cursorShadow = this.d3Cursor
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', smallScreen ? 6 : 10)
      .attr('fill', '#686354')
      .attr('class', 'cursor-shadow');

    /* We add the real cursor */
    this.d3Cursor
      .append('circle')
      .on('mouseover', () => this.cursorShadow.attr('filter', 'url(#cursorShadow)'))
      .on('mouseout', () => this.cursorShadow.attr('filter', ''))
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', smallScreen ? 6 : 10)
      .attr('class', 'cursor')
      .call(this.brush.event);

    this.options.data = this.options.interval.unit.utc.range.apply(null,
      this.options.domain.concat(this.options.interval.count))
      .map(date => ({ date }));

    /* set inner index to tell the timeline where should start to count once
      everything is initialized */
    this.currentDataIndex = this.getClosestDataIndex(this.cursorPosition);

    /* if the index is equal as the last one of data array
      means the cursor is in already in the last tick.
      if so, we set the index to null to tell timeline the next step
      is the first tick. */
    if (this.currentDataIndex == this.options.data.length - 1) {
      this.currentDataIndex = null;
    }

    // updates router with setted date
    this.triggerCursorDate(this.cursorPosition);
  }

  togglePlay() {
    if(!this.playing) {
      this.play();
    } else {
      this.stop();
    }
  }

  play() {
    if(this.playing) return;

    this.playing = true;
    this.buttonIcon.setAttribute('xlink:href', '#icon-pause');

    /* We move the cursor at the beginning if it's at the end */
    if(this.cursorPosition === this.options.domain[1]) {
      this.moveCursor(this.options.domain[0]);
    }

    this.animationFrame = setInterval(this.renderAnimationFrame.bind(this), 3000)
  }

  stop() {
    if(!this.playing) return;

    this.playing = false;
    this.buttonIcon.setAttribute('xlink:href', '#icon-play');

    clearInterval(this.animationFrame);

    /* We place the cursor at the end of the timeline if we reached the end */
    if(this.currentDataIndex === this.options.data.length - 1) {
      this.cursorPosition = this.options.domain[1];
      this.moveCursor(this.cursorPosition);
    }
  }

  renderAnimationFrame() {
    /* The first time the animation is requested, we place the cursor at the
     * beginning of the timeline */
    if(this.currentDataIndex === null || this.currentDataIndex === undefined ||
      this.cursorPosition === this.options.domain[1]) {
      this.currentDataIndex = -1;
      this.cursorPosition = this.options.domain[0];
      this.triggerCurrentData();
      this.moveCursor(this.cursorPosition);
    } else {
      this.cursorPosition = this.dayOffset(this.cursorPosition);

      /* We don't want to overpass the domain */
      if(this.cursorPosition > this.options.domain[1]) {
        this.cursorPosition = this.options.domain[1];
      }

      this.moveCursor(this.cursorPosition);
    }

    /* If the cursor has been moved above the next date with data, we set the
     * next data as the current ones and trigger them */
    if(this.currentDataIndex < this.options.data.length - 1 &&
      this.cursorPosition >= this.options.data[this.currentDataIndex + 1].date) {
      this.currentDataIndex++;
      this.triggerCurrentData();
    }

    /* We trigger the new range shown with the cursor as the end */
    this.triggerCursorDate(this.cursorPosition);

    /* Stops animation when reach end of the domain */
    if(!(this.cursorPosition < this.options.domain[1])) {
      this.stop();
    }
  }

  moveCursor(date) {
    this.brush.extent([date, date]);
    this.d3Cursor.attr('transform', () => `translate(${this.scale(date)})`);
    this.d3CursorLine.attr('x2', this.scale(date));
  }

  dayOffset(date) {
    //TODO - check if we need UTC time here or not.
    return moment.utc(new Date(date)).add(1, 'months').toDate();
  }

  onCursorStartDrag() {
    this.stop();
    document.body.classList.add('-grabbing');
  }

  onCursorEndDrag() {
    let resetCursorPosition = this.cursorPosition;
    const day = resetCursorPosition.date();
    resetCursorPosition.date(1);

    day > 15 &&
      resetCursorPosition.month() < 12 &&
        resetCursorPosition.month(resetCursorPosition.month()+1);

    this.cursorPosition = resetCursorPosition;
    this.moveCursor(resetCursorPosition);
    this.triggerCursorDate(resetCursorPosition);

    //TODO - when finish drag, send the cursor to neraest point
    this.cursorShadow.attr('filter', '');
    document.body.classList.remove('-grabbing');
  }

  onCursorDrag() {
    //TODO - send data only when crossing month point.
    if(!d3.event.sourceEvent) return;

    this.cursorShadow.attr('filter', 'url(#cursorShadow)');

    let date = this.scale.invert(d3.mouse(this.axis)[0]);
    if(date > this.options.domain[1]) date = this.options.domain[1];
    if(date < this.options.domain[0]) date = this.options.domain[0];

    /* We trigger the range currently selected in the timeline*/
    if ( date.getDate() === 1 && this.cursorPosition && this.cursorPosition.date() !== 1 ) this.triggerCursorDate(date);

    const dataIndex = this.getClosestDataIndex(date);
    if(dataIndex !== this.currentDataIndex) {
      this.currentDataIndex = this.getClosestDataIndex(date);
      /* We trigger the range of the currently available data */
      this.triggerCurrentData();
    }
    this.cursorPosition = moment.utc(date);
    this.moveCursor(date);
  }

  /* Return the index of the data item with the closest date to the one passed
   * as argument */
  getClosestDataIndex(date) {
    var current = 0;
    while(current <= this.options.data.length - 1) {
      if(this.options.data[current].date > date) {
        if(current === 0) return -1;
        return current - 1;
      }
      current++;
    }
    return this.options.data.length - 1;
  }

  /* Update the range of the timeline and its interval; shows ticks at the
   * extremities if true */
  setRange(domain, interval, extremityTicks) {
    this.options.domain = domain;
    this.options.ticksAtExtremities = !!extremityTicks;
    if(interval) this.options.interval = interval;
    this.setCursorPosition(this.options.domain[1]);
  }

  setCursorPosition(date) {
    if(!moment.utc(this.cursorPosition).isSame(date)) {
      this.cursorPosition = date;
      this.render();
      this.currentDataIndex = this.getClosestDataIndex(this.cursorPosition);
      this.triggerCurrentData()
    }
  }

};

/* The method is stored ouside of the class to enable it to be an IIFE */
TimelineView.prototype.triggerCursorDate = (function() {
  let oldEndDate = null;

  return _.throttle(function(endDate) {
    if(+oldEndDate === +endDate) return;

    const startDate  = moment.utc(this.scale.domain()[0]).add(1, 'days').toDate();

    this.options.triggerTimelineDates({
      from: startDate,
      to: endDate
    });

    oldEndDate = endDate;
  }, 20);

})();

/* As the method needs to be debounce, we need to declare it outside of the
 * class or create it as an instance method */
TimelineView.prototype.triggerCurrentData = (function() {

  return function() {
    const startDate  = moment.utc(this.scale.domain()[0]).toDate();
    let dataDate;
    if(this.currentDataIndex < 0) {
      dataDate = this.options.domain[0];
    } else {
      dataDate  = this.options.data[this.currentDataIndex].date;
    }

  };
})();

export default TimelineView;
