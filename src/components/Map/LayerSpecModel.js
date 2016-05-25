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

  // instanceLayer(month) {
  //   const MapLayer = mapLayers[this.attributes.type];
  //   this.instancedLayer = new MapLayer(this.attributes, month);
  //   return this.instancedLayer;
  // }

  instanceLayer(month) {
    const MapLayer = mapLayers[this.attributes.type];
    console.log(this.attributes)
    const newInstancedLayer = new MapLayer(this.attributes, month);

    console.log('instance layer', this.instancedLayer)
    console.log('instance newInstancedLayer', this.newInstancedLayer)

    if(!this.instancedLayer || newInstancedLayer.timestamp > this.instancedLayer.timestamp) {
      this.instancedLayer = newInstancedLayer;
      return this.instancedLayer;
    }
  }

}

LayerSpecModel.prototype.idAttribute = 'slug';

export default LayerSpecModel;
