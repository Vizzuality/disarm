'use strict';

import './styles.postcss';

import React from 'react';
import LayersSpecCollection from '../../Map/LayersSpecCollection';

class Legend extends React.Component {

  constructor(props) {
    super(props)

    this.layersSpecCollection = LayersSpecCollection;
  }

  _getLegendData() {
    const layerSpec = this.layersSpecCollection.findWhere({slug: this.props.slug});
    return layerSpec.get('legend');
  }

  render() {
    const legendData = this._getLegendData();
    const legendTypeClass = '-' + legendData.type;
    const buckets = [];

    legendData.buckets.forEach(function(bucket, i) {
      let style = { backgroundColor: bucket.color }
      buckets.push(
        <li className="legend-item" key={ bucket.literal }>
          <span className="bucket" style={ style }></span>
          <span className="text-legend">{ bucket.literal }</span>
        </li>
      );
    });

    return (
      <div className={`m-legend ${legendTypeClass}`}>
        <ul>
          { buckets }
        </ul>
      </div>
    )
  }
};

export default Legend;
