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
        <h2 className="country-title"> { this.props.country.name }</h2>
        <SwitcherLayers
          country= { this.props.country }
          setLayer={ this.props.setLayer.bind(this) }
        />
        { this.props.graph === true && <Chart month = { this.props.month } /> }
        <Share
          openModal = { this.props.openModal }
         />
      </div>
    );
  }

};

export default Dashboard;
