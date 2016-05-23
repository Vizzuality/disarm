'use strict';

import './styles.postcss';
import React from 'react';
import d3 from 'd3';
import $ from 'jquery';
import chartCollection from './../../scripts/collections/chartCollection';

class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      month: this.props.month,
      data: []
    };
    this.maxCases = 0;
  }

  componentWillReceiveProps() {
    chartCollection.getMonthCases(this.props.month).done(data=>{
      const dataTransformed = data.rows.map(date => ({cases: date.cases, day: parseInt(date.date.split('/')[1])}));
      this.setState({data: this.shortObjectArray(dataTransformed)});
      
      chartCollection.getMaxCases().done(data => {
        this.maxCases = data.rows[0].maxcases;
        this.setChart();
      });
    });
  }

  shortObjectArray(data) {
    return data.sort(function(a, b) {
      return a.day - b.day;
    });
  }

  setChart() {
    const data = this.state.data,
      width = 269,
      height = 140;

    if(document.getElementsByClassName('chart')[0].childNodes[0]) {
      document.getElementsByClassName('chart')[0].childNodes[0].remove();
    }

    const svg = d3.select(".chart").append("svg")
      .attr("class", "chart-svg")
      .append("g");

    const x = d3.scale.linear()
      .range([0, width]);

    const y = d3.scale.linear()
        .range([height, 0])
      .nice()
        ;

    x.domain([1, 30]);
    y.domain([0.1, this.maxCases]);

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
