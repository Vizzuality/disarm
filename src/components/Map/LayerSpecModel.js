'use strict';

import Backbone from 'backbone';
import CartoDBLayer from './Layers/CartoDBLayer';
import TorqueLayer from './Layers/TorqueLayer';

const mapLayers = {
  'cartodb': CartoDBLayer,
  'torque': TorqueLayer
};

class LayerSpecModel extends Backbone.Model {

  initialize() {
    this.on('change:zIndex', () => {
      console.log('change z-index');
    });
  }

  instanceLayer(month) {
    const MapLayer = mapLayers[this.attributes.type];
    const newInstancedLayer = new MapLayer(this.attributes, month);

    if(!this.instancedLayer || newInstancedLayer.timestamp > this.instancedLayer.timestamp) {
      this.instancedLayer = newInstancedLayer;
      return this.instancedLayer;
    }
  }

}

LayerSpecModel.prototype.idAttribute = 'slug';

export default LayerSpecModel;
