'use strict';

import React from 'react';
import SwitcherItem from './SwitcherItem';
import LayersSpecCollection from '../../Map/LayersSpecCollection';

class SwitcherLayers extends React.Component {

  constructor(props) {
    super(props);
  }

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
      <ul className="l-switcher">
        {SwitcherItemsNodes}
      </ul>
    );
  }

};

export default SwitcherLayers;
