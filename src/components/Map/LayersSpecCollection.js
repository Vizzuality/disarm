'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import LayerSpecModel from './LayerSpecModel';

class LayersSpecCollection extends Backbone.Collection {

  initialize() {
    this._layers = {}; // Layers instanced on map
  }

  setMap(map) {
    this.subscriber = map;
  }

  addLayer(id) {
    const layerSpec = this.get(id);
    const layer = this.getLayer(id);
    // Trying to not create a new instance every time
    if (!layer && layerSpec && !layerSpec.instancedLayer) {
      layerSpec.instanceLayer().createLayer((l) => {
        this.subscriber.addLayer(l);
        this._layers[id] = l;
      });
    } else if (!layer && layerSpec && layerSpec.instancedLayer &&
      layerSpec.instancedLayer.layer) {

      this.subscriber.addLayer(layerSpec.instancedLayer.layer);
      this._layers[id] = layerSpec.instancedLayer.layer;
    }
  }

  removeLayer(id) {
    const layer = this.getLayer(id);
    if (layer) {
      this.subscriber.removeLayer(layer);
      this.clearLayer(id);
    }

  }

  getLayer(id) {
    return this._layers[id];
  }

  clearLayer(id) {
    delete this._layers[id];
  }

  getCurrentLayer() {
    return this.toJSON().find((layer, i) => {
      return layer.active;
    });
  }

  // set every layer to active: false but the current one
  setCurrentLayer(slug) {

    const layerClone = _.clone(this.toJSON());

    _.each(layerClone, (layerSpec, i) => {
      layerSpec.active = false;
    });

    const currentLayer = _.find(layerClone, {slug: slug});

    if (currentLayer) {
      currentLayer.active = true;
    }

    this.reset(layerClone);
    console.log(layerClone);
  }

}

LayersSpecCollection.prototype.model = LayerSpecModel;

export default new LayersSpecCollection();
