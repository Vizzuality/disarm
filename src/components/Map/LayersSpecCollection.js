'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import layersData from '../../layerSpec.json';
import LayerSpecModel from './LayerSpecModel';

class LayersSpecCollection extends Backbone.Collection {

  initialize() {
    this._layers = {}; // Layers instanced on map
  }

  setMap(map) {
    this.subscriber = map;
  }

  addLayer(id, month) {
    const layerSpec = this.get(id);
    const layer = this.getLayer(id);

    // Trying to not create a new instance every time
    if (!layer && layerSpec && !layerSpec.instancedLayer) {
      layerSpec.instanceLayer(month)
        .createLayer((l) => {
          this.subscriber.addLayer(l);
          const zIndex = layerSpec.get('zIndex');
          l.setZIndex(zIndex)
          this._layers[id] = l;
        });
    } else if (!layer && layerSpec && layerSpec.instancedLayer) {
      this.subscriber.addLayer(layerSpec.instancedLayer.layer);
      this._layers[id] = layerSpec.instancedLayer.layer;
    }
  }

  updateLayer(id, currentMonth) {
    //add new instance but just after removing the current one with same id
    const layerSpec = this.get(id);
    console.log(layerSpec)
    layerSpec.instanceLayer(currentMonth)
      .createLayer((l) => {
        //This is important, getting sure that have removed all the layers with the same id before adding a new instance.
        this.removeLayer(id);
        this.subscriber.addLayer(l);
        const zIndex = layerSpec.get('zIndex');
        l.setZIndex(zIndex)
        this._layers[id] = l;
      });
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

  setCurrentLayer(layer) {
    const layerClone = _.clone(this.toJSON());

    _.each(layerClone, (layerSpec, i) => {
      if (layerSpec.slug == layer.slug) {
        layerSpec.active = layer.active;
      }
    });

    this.reset(layerClone);
  }

  setLayersSpec(countrySlug) {
    const countryLayersSpec = this.where({ country: countrySlug });
    
    this.reset(countryLayersSpec);
  }
}

LayersSpecCollection.prototype.model = LayerSpecModel;

export default new LayersSpecCollection(layersData);
