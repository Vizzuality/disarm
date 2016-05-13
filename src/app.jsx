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
import monthDataCollection from './scripts/collection/MonthDataCollection';

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
      timelineDate: moment.utc('2012-12-01').toDate()
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
      console.log('timeline dates', moment.utc(dates.to).format());
      const date = moment.utc(dates.to).format('YYYY-MM-DD')
      this.setState({ timelineDate: date });
      router.update({ timelineDate: date });
    };

    const timelineParams = {
      cursorPosition: moment.utc(this.state.timelineDate),
      el: document.getElementById('timeline'),
      interval: {
        unit: d3.time.month
      },
      triggerTimelineDates: updateTimelineDates.bind(this),
      ticksAtExtremities: false
    };


    this.timeline = new TimelineView(timelineParams);
  }

  componentDidMount() {
    this._initData();
    this._initTimeline();
    this._setListeners();
  }

  _initData() {
    /**
     * To avoid extra renders before having the data, we set an extra param 'ready' to let the app now when it should initialize.
     */
    monthDataCollection.fetch().done(_.bind(function(res){
      this.setState({ ready: true });
    }, this));
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
    let content = '';

    if (this.state.ready) {
      content =
      <Dashboard
        layersSpecCollection = { this.state.layersSpecCollection }
        setLayer = { this.activeLayer.bind(this) }
        openModal = { this.handleInfowindow.bind(this)}
        timelineDate = { this.state.timelineDate }
      />
    }

    return (
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
         <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>
        { content }
      </div>
    );
  }
}

// Initializing app
ReactDOM.render(<App />, document.getElementById('app'));
