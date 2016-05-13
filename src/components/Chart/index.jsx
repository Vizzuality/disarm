'use strict';

import './styles.postcss';
import React from 'react';
import $ from 'jquery';
import d3 from 'd3';
import _ from 'underscore';
import moment from 'moment';
import monthDataCollection from './../../scripts/collection/MonthDataCollection';

class Chart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: monthDataCollection.toJSON()
    }
  }

  componentDidMount() {
    this._setChart();
  }

  componentWillUpdate() {
    this._setChart();
  }

  _getcurrentData() {
    this.month = moment(this.props.timelineDate).month();
    return this.state.data[0][this.month];
  }

  _setChart() {
    this._removePreviousGraph();
    const data = this._getcurrentData();
    const width = $("#chart").width() + 20;
    const height = $("#chart").height() - 30;

    const svg = d3.select(".chart").append("svg")
      .attr("class", "chart-svg")
      .html("g");

    const x = d3.scale.linear()
      .range([0, width]);

    const y = d3.scale.linear()
        .range([height, 0]);

    x.domain([1, 30]);
    y.domain([0.1, 100]);

    this.setXAxis(svg, x);
    this.setYAxis(svg, y);
    this.setLine(svg, x, y, data);
  }

  setXAxis(svg, x) {
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(24, 147)")
      .call(xAxis);
  }

  setYAxis(svg, y) {
    const yAxis = d3.svg.axis()
      .scale(y)
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
      .y(function(d) { return y(d.count); });

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform", "translate(24, 6)")
      .attr("d", line);
  }

  _removePreviousGraph() {
    $('.chart-svg').remove();
  }

  render() {
    return (
      <div ref="ChartElement" className="c-chart">
        <div id="chart" className="chart"></div>
        <div className="chart-legend"><div className="legend-img"></div>{`Malaria cases (current month ${this.month})`}</div>
      </div>
    );
  }
};

export default Chart;
