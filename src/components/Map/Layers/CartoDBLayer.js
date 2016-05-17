'use strict';

import $ from 'jquery';
import _ from 'underscore';

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

    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: `http://${account}.cartodb.com/api/v1/map/`,
      data: JSON.stringify({layers: layersSpec}),
      success: (data) => {
        const tileUrl = `https://${account}.cartodb.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png32`;
        this.layer = L.tileLayer(tileUrl);
        if (callback && typeof callback === 'function') {
          callback(this.layer);
        }
      }
    });
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
