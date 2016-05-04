'use strict';

import './styles.postcss';

import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Map from './components/Map';
// import Dashboard from './components/Dashboard';
import TimelineView from './components/Timeline';
import Router from './components/Router';
import layersData from './layerSpec.json';

const mapOptions = {
  center: [40, -3],
  zoom: 3,
  basemapSpec: {
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    options: {
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    	subdomains: 'abcd',
    	maxZoom: 19
    }
  }
};

/**
 * Router definition
 */
class AppRouter extends Router {}
// Overriding default routes
AppRouter.prototype.routes = {
  '': function() {
    console.info('you are on welcome');
  },
  'map': function() {
    console.info('you are on map');
  }
};
const router = new AppRouter();

/**
 * App definition
 */
class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    router.start();
  }

  updateRouter() {
    const params = this.refs.Map.state;
    router.update(params);
  }

  _initTimeline() {
    // const wholeRange = [
    //   new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
    //   new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    // ];

    const updateTimelineDates = function(dates) {
      this.setState({ timelineDates: dates });
      router.update({
        timelineDate: moment.utc(dates.to).format('YYYY-MM-DD')
      });
    };

    const updateMapDates = function (dates) {
      this.setState({ mapDates: dates });
      //MAP STATE CHANGE
      // console.log(dates);
      // this.mapView.state.set({ timelineDates: dates });
    };

    const timelineParams = {
      el: document.getElementById('timeline'),
      // domain: wholeRange,
      interval: {
        unit: d3.time.week.utc
      },
      // filters: this.state.filters,
      triggerTimelineDates: updateTimelineDates.bind(this),
      triggerMapDates: updateMapDates.bind(this),
      ticksAtExtremities: false
    };

    // /* We retrieve the position of the cursor from the URL if exists */
    // if(this.router.params.toJSON().timelineDate) {
    //   const date = moment.utc(this.router.params.toJSON().timelineDate, 'YYYY-MM-DD');
    //   if(date.isValid()) {
    //     timelineParams.cursorPosition = date.toDate();
    //   }
    // }

    this.timeline = new TimelineView(timelineParams);

    /* On init, we need to show only the range passed as argument */
    // const interval = this.state.dataInterval[this.state.mode];
    // if(this.state.filters.from || this.state.filters.to) {
    //   const range = [ this.state.filters.from, this.state.filters.to ];
    //   this.timeline.setRange(range, interval, true);
    // }
  }

  componentDidMount() {
    this._initTimeline();
  }

  render() {
    // Getting params from router before render map
    // const center = [router.params.get('lat'), router.params.get('lng')];
    // const options = _.extend({}, mapOptions, {
    //   center: center,
    //   zoom: router.params.get('zoom')
    // });
    return (
      <div>
        <div className="l-app">
          <Map ref="Map"
            mapOptions={ mapOptions }
            layersData={ layersData }
            onLoad={ this.updateRouter.bind(this) }
            onChange={ this.updateRouter.bind(this) } />
          <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
            <svg className="btn js-button">
              <use xlinkHref="#icon-play" className="js-button-icon"></use>
            </svg>
            <div className="svg-container js-svg-container"></div>
          </div>
        </div>
      </div>
    );
  }

}

// Initializing app
ReactDOM.render(<App />, document.getElementById('app'));