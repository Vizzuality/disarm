'use strict';

import './styles.postcss';
import React from 'react';
import d3 from 'd3';
import $ from 'jquery';
import moment from 'moment';
import chartCollection from './../../scripts/collections/chartCollection';
import utils from './../../scripts/helpers/utils';

class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.maxCases = 0;
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  printChart() {
    chartCollection.getMonthCases().done( data => {
      const monthDates = data.rows.filter( date => {
        let dayDate = moment(date.date.replace(/\//g, '-'), 'MM-DD-YY');
        return dayDate.month() + 1 === this.props.month;
      });
      const dataTransformed = monthDates.map( date => {
        let dateMoment = moment(date.date.replace(/\//g, '-'), 'MM-DD-YY');
        return { cases: date.cases, day: parseInt(dateMoment.date()) };
      });

      this.setState({data: this.fillData(dataTransformed)});
      
      chartCollection.getMaxCases().done(data => {
        this.maxCases = data.rows[0].maxcases;
        this.setChart();
        this.setState({month: this.props.month});
      });
    });
  }

  componentDidUpdate() {
    if(this.state.month !== this.props.month) {
      this.printChart();
    }
  }

  shortObjectArray(data) {
    return data.sort(function(a, b) {
      return a.day - b.day;
    });
  }

  fillData(data) {
    let fullMonth = [];
    for(let i = 1; i <= 31; i++) {
      const day = data.filter(day => day.day === i );
      if(day.length !== 0) {
        fullMonth.push(day[0]);
      }
      else {
        fullMonth.push({day: i, cases: 0});
      }
    }
    return fullMonth;
  }

  setChart() {
    const data = this.state.data,
      width = this.state.mobile ? 239 : 269,
      height = 140;

    if(document.getElementsByClassName('chart')[0].childNodes[0]) {
      document.getElementsByClassName('chart')[0].childNodes[0].remove();
    }

    const svg = d3.select(".chart").append("svg")
      .attr("class", "chart-svg")
      .append("g");

    const x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    const y = d3.scale.linear()
        .range([height, 0])
      .nice()
        ;

    x.domain(this.state.data.map(function(d) { return d.day; }));
    y.domain([0.1, this.maxCases]);

    this.setXAxis(svg, x);
    this.setYAxis(svg, y);
    //this.setLine(svg, x, y, data);
    this.setBars(svg, x, y, height);
  }

  setXAxis(svg, x) {
    const xAxis = d3.svg.axis()
      .scale(x)
      .tickValues([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31])
      .orient("bottom");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(24, 147)")
      .call(xAxis);
  }

  setYAxis(svg, y) {
    const yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat(d3.format("d"))
      .orient("left");

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(27, 6)")
      .call(yAxis);
  }

  setLine(svg, x, y, data) {
    const line = d3.svg.line()
      .interpolate("monotone")
      .x(function(d) { return x(d.day); })
      .y(function(d) { return y(d.cases); });

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform", "translate(24, 6)")
      .attr("d", line);
  }

  setBars(svg, x, y, height) {
    svg.selectAll(".bar")
      .data(this.state.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.day) + 24; })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.cases) + 4; })
      .attr("height", function(d) { return 142.5 - y(d.cases); });
  }

  render() {
    return (
      <div ref="ChartElement" className="c-chart">
        <div id="chart" className="chart"></div>
        <div className="chart-legend"><div className="legend-img"></div>Malaria cases (current month)</div>
      </div>
    );
  }
};

export default Chart;
