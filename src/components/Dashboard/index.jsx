'use strict';

import './styles.postcss';

import _ from 'underscore';
import React from 'react';
import SwitcherLayers from './SwitcherLayers';
import Chart from './../Chart';
import Share from './Share';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="dashboard" className="l-dashboard c-dashboard">
        <h2 className="country-title">Swaziland</h2>
        <SwitcherLayers
          setLayer={ this.props.setLayer.bind(this) }
        />
        { this.props.graph === true && <Chart /> }
        <Share
          openModal = { this.props.openModal }
         />
      </div>
    );
  }

};

export default Dashboard;
