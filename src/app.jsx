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
import LayersSpecCollection from './components/Map/LayersSpecCollection';

const mapOptions = {
  center: [-26.799557733065328, 31.338500976562496], // Swaziland
  zoom: 9,
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

    this.state = {
      layersSpecCollection: LayersSpecCollection,
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
      // this.setState({ timelineDates: dates });
      const timelineDate = moment.utc(dates.to).format('YYYY-MM-DD');

      router.update({
        timelineDate
      });
      this.setState({timelineDate});
    };

    const updateMapDates = function (dates) {
      // this.setState({ mapDates: dates });

      //MAP STATE CHANGE
      // console.log(dates);
      // this.mapView.state.set({ timelineDates: dates });
    };

    const timelineParams = {
      cursorPosition: moment.utc(this.state.timelineDate),
      el: document.getElementById('timeline'),
      interval: {
        unit: d3.time.month
      },
      triggerTimelineDates: updateTimelineDates.bind(this),
      triggerMapDates: updateMapDates.bind(this),
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
    const newState = _.extend({}, newMapOptions, layers, timelineDate, currentRoute);

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
    let date = this.state.timelineDate;
    return date.split('-')[1];
  }

  render() {
    return (
      <div>

        <div className="l-app">
          <Header
            currentRoute= { this.state.route }
            onChangeRoute= { this.onChangeRoute.bind(this) }
           />
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

            month = { this.getMonth() }
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
