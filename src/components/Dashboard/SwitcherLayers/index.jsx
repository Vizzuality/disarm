'use strict';

import React from 'react';
import SwitcherItem from './SwitcherItem';
import LayersSpecCollection from '../../Map/LayersSpecCollection';

class SwitcherLayers extends React.Component {

  constructor(props) {
    super(props);
  }

  // _updateStatus(params) {
  //   const layerSpec = this.props.layersData.find((layer, i) => {
  //     return layer.name == params.name;
  //   });
  //
  //   if (layerSpec) {
  //     layerSpec.active =  params.active;
  //   }
  //   this.props.onChange(this.props.layersData);
  // }

  render() {
    const layersSpecCollection= LayersSpecCollection.toJSON();

    var SwitcherItemsNodes = layersSpecCollection.map(function(layer, i) {
      return <SwitcherItem
        key={ i }
        name={ layer.name }
        slug={ layer.slug }
        active={ layer.active }
        setLayer={ this.props.setLayer.bind(this) } />
    }.bind(this));

    return (
      <ul className="c-switcher">
        {SwitcherItemsNodes}
      </ul>
    );
  }

};

export default SwitcherLayers;
