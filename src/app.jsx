'use strict';

import './styles/layout.postcss';

import _ from 'underscore';
import Backbone from 'backbone';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Header from './components/Header';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import DownloadInfoWindow from './components/Infowindow/Download';
import TableInfoWindow from './components/Infowindow/Table';
import TimelineView from './components/Timeline';
import Router from './components/Router';
import layersData from './layerSpec.json';
import LayersSpecCollection from './components/Map/LayersSpecCollection';

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

    const layersSpecCollection = LayersSpecCollection;
    layersSpecCollection.set(layersData);

    this.state = {
      layersSpecCollection: layersSpecCollection,
      mapOptions: mapOptions,
      downloadInfoWindow: {
        isHidden: true
      },
      tableInfoWindow: {
        isHidden: true
      },
      layers: [],
      timelineDate: moment.utc('2012-11-01').toDate()
    };
  }

  _setListeners() {
    this.state.layersSpecCollection.on('change reset', () => {
      this.refs.Map.updateLayers();
    }).bind(this);
  }

  componentWillMount() {
    router.start();
    this.setState(router.params.attributes);
    router.on('route', () => {
      this.setState(router.params.attributes);
    });

    this._getRouterParams();
  }

  updateRouter(params) {
    router.update(params);
  }

  _initTimeline() {

    const updateTimelineDates = function(dates) {
      console.log('timeline dates', dates.to)
      // this.setState({ timelineDates: dates });

      router.update({
        timelineDate: moment.utc(dates.to).format('YYYY-MM-DD')
      });
    };

    const updateMapDates = function (dates) {
      // this.setState({ mapDates: dates });

      //MAP STATE CHANGE
      // console.log(dates);
      // this.mapView.state.set({ timelineDates: dates });
    };

    const timelineParams = {
      cursorPosition: moment(this.state.timelineDate),
      el: document.getElementById('timeline'),
      interval: {
        unit: d3.time.month.utc
      },
      triggerTimelineDates: updateTimelineDates.bind(this),
      triggerMapDates: updateMapDates.bind(this),
      ticksAtExtremities: false
    };

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
    this._setListeners();
  }

  activeLayer(layer) {
    this.state.layersSpecCollection.setCurrentLayer(layer);
  }

  handleInfowindow(modal) {
    this.state[modal] = {
      isHidden: !this.state[modal].isHidden
    };

    this.setState(this.state);
  }

  _getRouterParams() {
    const newMapOptions = _.extend(mapOptions, {
      center: router.params.get('lat') ? [router.params.get('lat'), router.params.get('lng')] : mapOptions.center,
      zoom: router.params.get('zoom') ? router.params.get('zoom') : mapOptions.zoom
    });

    //TODO: desactivate default layer.
    const layers = router.params.get('layers') ? router.params.get('layers') : [];
    const timelineDate = router.params.get('timelineDate') || this.state.timelineDate;
    const newState = _.extend({}, newMapOptions, layers, timelineDate);

    //This is to active a new layer and set it to collection.
    if (layers) {
      _.each(layers, _.bind(function(layer) {
        const currentLayer = _.where(this.state.layersSpecCollection.toJSON(), { slug: layer })[0];
        currentLayer.active = true;
        this.activeLayer(currentLayer);
      }, this))
    }

    this.setState(newState);
  }

  render() {
    // Getting params from router before render map
    // const center = [router.params.get('lat'), router.params.get('lng')];
    // const layer = [router.params.get('layer')]
    //
    // _.extend(mapOptions, {
    //   center: center[0] ? center : mapOptions.center,
    //   zoom: router.params.get('zoom')  || mapOptions.zoom,
    //   layer: layer
    // });
    //

    return (
      <div>

        <div className="l-app">
          <Header />
          <TableInfoWindow
            isHidden= {this.state.tableInfoWindow.isHidden}
            onClose={this.handleInfowindow.bind(this, 'tableInfoWindow')}
           />
          <DownloadInfoWindow
            isHidden= {this.state.downloadInfoWindow.isHidden}
            onClose={this.handleInfowindow.bind(this, 'downloadInfoWindow')}
          />
          <Map ref="Map"
            mapOptions={ mapOptions }
            layers = { this.state.layers }
            // onLoad={ this.updateRouter.bind(this) }
            onChange={ this.updateRouter.bind(this) }
          />
          <Dashboard
            layersSpecCollection = { this.state.layersSpecCollection }
            setLayer = { this.activeLayer.bind(this) }
            openModal = { this.handleInfowindow.bind(this)}
          />
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
