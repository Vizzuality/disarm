'use strict';

import $ from 'jquery';
import _ from 'underscore';

import '../styles.postcss';

import infowindowTemplate from '../infowindow.handlebars';

/**
 * @example
 * const layer = new CartoDBLayer({
 *   account: String, // required
 *   sql: String, // required
 *   cartocss: String, // required
 * });
 * layer.addLayer(map, function(l) {
 *   // useful to work with layer
 * });
 */
class CartoDBLayer {

  constructor(props) {
    this.options = props;
  }

  createLayer(callback) {
    const account = this.options.account;
    const isRaster = this.options.isRaster ? true : false;
    const hasInteractivity = this.options.hasOwnProperty('interactivity');

    // common params
    let layersSpec = [{
      user_name: account,
      type: 'cartodb'
    }];

    if (!isRaster) {

      const layersParams = {
        options: {
          sql: this.options.sql,
          cartocss: this.options.cartocss,
          cartocss_version: '2.3.0'
        }
      };

      _.extend(layersSpec[0], layersParams);

    } else {

      const rasterParams = {
        options: {
          sql: this.options.sublayers[0].sql,
          cartocss: this.options.sublayers[0].cartocss,
          raster: this.options.sublayers[0].raster,
          raster_band: this.options.sublayers[0].raster_band,
          geom_type: 'raster',
          geom_column: 'the_raster_webmercator',
          cartocss_version: '2.3.0'
        }
      };

      _.extend(layersSpec[0], rasterParams);

    }

    if (!hasInteractivity) {

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        url: `http://${account}.cartodb.com/api/v1/map/`,
        data: JSON.stringify({layers: layersSpec}),
        success: (data) => {
          const tileUrl = `https://${account}.cartodb.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png32`;
          this.layer = L.tileLayer(tileUrl);
          if (callback && typeof callback == 'function') {
            callback(this.layer);
          }
        }
      });
    } else {

      const query = layersSpec[0].options.sql;

      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: `http://${account}.cartodb.com/api/v2/sql?q=`,
        data: {
          q: query,
          format: 'geojson'
        },
        success: (geojson) => {

          var layer = L.geoJson(geojson, {
            pointToLayer: (feature, latlng) => {
              const data = {
                facilityName: feature.properties.facility_name
              };
              const infowindow = infowindowTemplate(data);
              const areaIcon = L.divIcon({
                className: 'm-marker'
              });

              return L.marker(latlng,{icon: areaIcon}).bindPopup(infowindow, {
                className: 'm-infowindow'
              });
            }

          });

          if (callback && typeof callback == 'function') {
            callback(layer);
          }
        }
      });
    }

  }

  /**
   * Add layer to map
   * @param  {L.Map} map
   * @param {Function} callback
   */
  addLayer(map, callback) {
    // If layer exists so it will be added to map
    if (this.layer && map) {
      return map.addLayer(this.layer);
    }

    if (!map) {
      throw new Error('map param is required');
    }

    // Creating layer if layer doesn't exist
    this.createLayer((layer) => {
      this.layer = layer;
      map.addLayer(this.layer);
      if (callback && typeof callback === 'function') {
        callback(this.layer);
      }
    });
  }

  /**
   * Remove layer from map
   * @param  {L.Map} map
   */
  removeLayer(map) {
    if (map && this.layer) {
      map.removeLayer(this.layer);
    }
  }

}

export default CartoDBLayer;
