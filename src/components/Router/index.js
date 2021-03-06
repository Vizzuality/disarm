'use strict';

import Backbone from 'backbone';
import URI from 'urijs';
import ParamsModel from './ParamsModel';

class Router extends Backbone.Router {

  initialize() {
    this.params = new ParamsModel();

    this.route('', 'index', () => {
      this.navigate('map', {trigger: true});
    }).bind(this);

    this.route('map', 'map');
    this.route('about', 'about');
  }

  /**
   * Middleware for all routes
   * http://backbonejs.org/#Router-execute
   * @param  {Function} callback
   * @param  {Object} args
   * @param  {String} currentRoute
   */
  execute(callback, args, currentRoute) {
    this.currentRoute = currentRoute;
    if (args[0]) {
      this.params.set(this.parseParams(args[0]));
    }
    if (callback) {
      callback.apply(this, args);
    }
  }

  /**
   * Use this method to update URL from navigator
   * @param  {Object} params
   */
  update(params) {
    this.params.set(params, { validate: true, trigger: false });
    const routeString = this.serializeParams(this.params.attributes);
    this.navigate(`${this.currentRoute || ''}${routeString}`);
  }

  /**
   * Parse URL params using URI.js API
   * @param  {String} queryString https://medialize.github.io/URI.js/docs.html
   * @return {Object}
   */
  parseParams(queryString) {
    let params = URI.parseQuery(`?${queryString}`);
    if(params.hasOwnProperty('layers[]')) {
      if(params['layers[]']) {
        params.layers = Array.isArray(params['layers[]']) ? params['layers[]'] : [ params['layers[]'] ];
      }
      delete params['layers[]'];
    }

    return params;
  }

  /**
   * Serialze URL params using URI.js API
   * @param  {Object} params https://medialize.github.io/URI.js/docs.html
   * @return {String}
   */
  serializeParams(params) {
    let queryString = URI.buildQuery(params);
    queryString = queryString.replace(/layers=/g, 'layers[]=');
    return `?${queryString}`;
  }

  /**
   * Use it to start history HTML5 API
   */
  start(options) {
    let opts = options;
    if (!opts) {
      opts = { pushState: false };
    }
    Backbone.history.start(opts);
  }

}

export default Router;
