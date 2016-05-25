'use strict';

import React from 'react';
import SwitcherItem from './SwitcherItem';
import LayersSpecCollection from '../../Map/LayersSpecCollection';

class SwitcherLayers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const SwitcherItemsNodes = LayersSpecCollection.map(function(l, i) {
      let layer = l.toJSON();

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
