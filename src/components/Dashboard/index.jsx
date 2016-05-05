'use strict';

import _ from 'underscore';
import React from 'react';
import SwitcherLayers from './SwitcherLayers';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  // _getStatusLayers(params) {
  //   this.props.onChange(params)
  // }

  render() {
    return (
      <div id="dashboard" className="l-dashboard">
        <h2>Swaziland</h2>
        <SwitcherLayers
          setLayer={ this.props.setLayer.bind(this) }
        />
      </div>
    );
  }

};

export default Dashboard;
