'use strict';

import './styles/layout.postcss';

import _ from 'underscore';
import Backbone from 'backbone';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Header from './components/Header';
import MenuDevice from './components/MenuDevice'
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import DownloadInfoWindow from './components/Infowindow/Download';
import TableInfoWindow from './components/Infowindow/Table';
import TimelineView from './components/Timeline';
import Router from './components/Router';
import LayersSpecCollection from './components/Map/LayersSpecCollection';


import Config from './scripts/config.json';
import utils from './scripts/helpers/utils';


const mapOptions = {
  zoom: 7,
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
// AppRouter.prototype.routes = {
//   '': function() {
//     this.navigate('test', {trigger: true});
//   },
//
//   'map': function() {
//     console.info('you are on map');
//   },
//   'about': function() {
//     console.info('you are on about');
//   },
// };
const router = new AppRouter();

/**
 * App definition
 */
class App extends React.Component {

  constructor(props) {
    super(props);

    this.config = Config;

    this.state = {
      country: this._getCountry(),
      downloadInfoWindow: {
        isHidden: true
      },
      tableInfoWindow: {
        isHidden: true
      },
      menuDeviceOpen: false,
      layers: [],
      timelineDate: '2012-12-01',
      graph: true
    };

    Object.assign(this.state, {
      layersSpecCollection: this._getLayersSpec(),
      mapOptions: this._getMapOptions(),
    });
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
      const newState = router.params.attributes;
      if(router.params.get('graph')) {
        newState['graph'] = router.params.get('graph') === 'true';
      }
      else newState['graph'] = true;
      this.setState(newState);
    });

    this._getRouterParams();

    Object.assign(this.state, utils.checkDevice())
  }

  _getCountry() {
    const countries = this.config['countries'];
    const subdomain = this._getSubdomain();

    let country = countries[countries['default']];

    if (subdomain !== 'localhost' && countries.hasOwnProperty(subdomain)) {
      country = countries[subdomain];
    }

    return country;
  }

  _getLayersSpec() {
    const countrySlug = this.state.country.slug;

    LayersSpecCollection.setLayersSpec(countrySlug);

    return LayersSpecCollection;
  }

  _getMapOptions() {
    const countryMap = this.state.country.map;
    const countryCenter = [countryMap.latitude, countryMap.longitude]

    Object.assign(mapOptions, {
      center: countryCenter
    });

    return mapOptions;
  }

  _getSubdomain() {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.', 1);

    return subdomain[0];
  }

  updateRouter(params) {
    router.update(params);
  }

  toggleMenu() {
	 this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  _initTimeline() {
    const updateTimelineDates = function(dates) {
      console.log('timeline dates', moment.utc(dates.to).format());
      const timelineDate = moment.utc(dates.to).format('YYYY-MM-DD');

      router.update({ timelineDate });
      this.setState({ timelineDate });
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

  onChangeRoute(route) {
    this.setState({ route: route });
  }

  _getRouterParams() {
    const newMapOptions = _.extend(mapOptions, {
      center: router.params.get('lat') ? [router.params.get('lat'), router.params.get('lng')] : mapOptions.center,
      zoom: router.params.get('zoom') ? router.params.get('zoom') : mapOptions.zoom
    });

    //TODO: desactivate default layer.
    const layers = router.params.get('layers') ? router.params.get('layers') : [];
    const timelineDate = router.params.get('timelineDate') || this.state.timelineDate;
    const currentRoute = {
      route: router.currentRoute
    };
    let graph = true;
    if(router.params.get('graph')) {
      graph = router.params.get('graph') === 'true';
    }
    const newState = _.extend({}, newMapOptions, layers, timelineDate, graph, currentRoute);

    if (layers.length > 0) {

      _.each(LayersSpecCollection.models, (layerSpec) => {
        layerSpec.set({active: false});
      });

      _.each(layers, (layerSlug) => {
        const currentLayer = LayersSpecCollection.findWhere({ slug: layerSlug });

        if (currentLayer) {
          currentLayer.set({active: true});
          this.activeLayer(currentLayer);
        }

      });
    }
    this.setState(newState);
  }

  getMonth() {
    const date = moment(this.state.timelineDate);
    return date.month()+1;
  }

  render() {
    return (
      <div>
        <div className="l-app">
          <Header
            currentRoute= { this.state.route }
            onChangeRoute= { this.onChangeRoute.bind(this) }
            toggleMenuFn = { this.toggleMenu.bind(this) }
           />
          {this.state.mobile && <MenuDevice
            currentRoute = { this.state.route }
            deviceMenuOpen = { this.state.menuDeviceOpen }
            toggleMenuFn = { this.toggleMenu.bind(this) }
          /> }
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
            timelineDate = { this.state.timelineDate }
            month = {this.getMonth()}
          />
          <Dashboard
            country = { this.state.country }
            layersSpecCollection = { this.state.layersSpecCollection }
            setLayer = { this.activeLayer.bind(this) }
            openModal = { this.handleInfowindow.bind(this)}
            month = { this.getMonth() }
            graph = { this.state.graph }
          />
          <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
            <svg className="btn js-button">
              <use xlinkHref="#icon-play" className="js-button-icon"></use>
            </svg>
            <div className="svg-container js-svg-container"></div>
          </div>
          <div id="map-credits" className="l-map-credits">
            <div className="leaflet-control-attribution leaflet-control">
              <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | © 
              <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> © 
              <a href="http://cartodb.com/attributions">CartoDB</a>
            </div>
         </div>
        </div>
      </div>
    );
  }
}

// Initializing app
ReactDOM.render(<App />, document.getElementById('app'));
