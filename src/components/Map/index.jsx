'use strict';

import './style.css';
import _ from 'underscore';
import React from 'react';
import Legend from './Legend';
import LayersSpecCollection from './LayersSpecCollection';

class Map extends React.Component {

  constructor(props) {
    super(props);
    if (props.layersData) {
      this.layersSpec = new LayersSpecCollection(props.layersData);
    }
    this.state = {
      zoom: props.mapOptions.zoom,
      lat: props.mapOptions.center[0],
      lng: props.mapOptions.center[1]
    };
  }

  /**
   * Create map using Leaflet
   * http://leafletjs.com/reference.html#map-usage
   */
  createMap() {
    this.map = L.map(this.refs.MapElement, this.props.mapOptions);
    this.layersSpec.setMap(this.map);
    // Setting basemap
    this.setBasemap();
    // Exposing some events
    // this.map.on('click', this.props.onClick);
    // this.map.on('load', this.props.onLoad); // This doesn't work -.-
    // this.map.on('moveend', () => {
    //   const center = this.map.getCenter();
    //   const nextState = {
    //     zoom: this.map.getZoom(),
    //     lng: center.lng,
    //     lat: center.lat
    //   };
    //   this.setState(nextState);
    //   this.props.onChange(nextState);
    // });

    // Hack -> because on "load" doesn't work -.-
    // setTimeout(() => this.map.fire('load'), 0);
  }

  /**
   * Add basemap to map, use this to add other basemap instead current
   * @param {Object} basemapSpec http://leafletjs.com/reference.html#tilelayer
   */
  setBasemap(basemapSpec) {
    const currentBasemap = basemapSpec || this.props.mapOptions.basemapSpec;
    if (this.basemap) {
      this.map.removeLayer(this.basemap);
    }
    this.basemap = L.tileLayer(currentBasemap.url, currentBasemap.options);
    this.map.addLayer(this.basemap, {zIndex: -1}); // always on back
  }

  /**
   * This method will update all layers
   */
  setLayers() {
    _.each(this.layersSpec.models, layerSpec => {
      if (!layerSpec.get('active')) {
        this.removeLayer(layerSpec.id);
      } else {
        this.addLayer(layerSpec.id);
      }
    });
  }

  /**
   * Method to add a layer
   * @param {String} slug
   */
  addLayer(slug) {
    this.layersSpec.addLayer(slug);
  }

  /**
   * Method to remove a layer from map
   * @param  {String} slug
   */
  removeLayer(slug) {
    this.layersSpec.removeLayer(slug);
  }

  /**
   * When DOM exists create map
   */
  componentDidMount() {
    this.createMap();
    this.setLayers();
    this.layersSpec.on('change', this.setLayers.bind(this));
  }

  /**
   * Avoid render, this component doesn't use Virtual DOM
   * @return false
   */
  shouldComponentUpdate() {
    return false;
  }

  render() {
    let legend = null;
    if (this.props.legend) {
      legend = (<Legend layersSpec={ this.layersSpec } />);
    }
    return (
      <div ref="MapElement" className="c-map">
        { legend }
      </div>
    );
  }

}

Map.propTypes = {
  layersData: React.PropTypes.array, // JSON array
  mapOptions: React.PropTypes.object, // http://leafletjs.com/reference.html#map-usage
  legend: React.PropTypes.bool,
  onLoad: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onChange: React.PropTypes.func
};

Map.defaultProps = {
  mapOptions: {
    zoom: 5,
    center: [40, -3], // Madrid
    scrollWheelZoom: false,
    basemapSpec: {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      options: {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  },
  legend: true,
  onClick: function() {},
  onChange: function() {}
};

export default Map;