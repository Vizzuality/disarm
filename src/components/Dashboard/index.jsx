'use strict';

import './styles.postcss';

import _ from 'underscore';
import React from 'react';
import SwitcherLayers from './SwitcherLayers';
import Chart from './../Chart';
import Share from './Share';
import utils from '../../scripts/helpers/utils';


class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardOpen: true
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  toogleDashboard() {
    this.setState({ dashboardOpen: !this.state.dashboardOpen })
  }


  render() {
  const dashboardClass = this.state.dashboardOpen ?
    this.state.mobile ?
        "l-dashboard is-open -mobile" :
          "l-dashboard is-open -pc" :
        "l-dashboard";

    return (
      <div id="dashboard" className={ dashboardClass }>
        <button
          className="btn-dashboard-switcher -left"
          onClick={ this.toogleDashboard.bind(this) }
        >
          <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
        </button>

        <button
          className="btn-dashboard-switcher -bottom"
          onClick={ this.toogleDashboard.bind(this) }
        >
          <svg className="icon icon-arrow"><use xlinkHref="#icon-arrow"></use></svg>
        </button>
        <div className="content-container">
          <h2 className="country-title">Swaziland</h2>
          <div className="content">
            <SwitcherLayers
              setLayer={ this.props.setLayer.bind(this) }
            />
            { this.props.graph === true && <Chart month = { this.props.month } /> }
            <Share
              openModal = { this.props.openModal }
             />
           </div>
        </div>
      </div>
    );
  }

};

export default Dashboard;
