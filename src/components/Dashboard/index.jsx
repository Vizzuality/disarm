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

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.donation !== nextProps.donation ||
      this.props.currentMode !== nextProps.currentMode ||
      this.props.layer !== nextProps.layer ||
      this.props.filters !== nextProps.filters ||
      this.props.sectors !== nextProps.sectors ||
      this.props.timelineDate !== nextProps.timelineDate ||
      this.state.dashboardOpen !== nextState.dashboardOpen) {
      return true;
    }

    return false;
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
        <h2 className="country-title">Swaziland</h2>
        <div className="content-container">
          <SwitcherLayers
            setLayer={ this.props.setLayer.bind(this) }
          />
          { this.props.graph === true && <Chart /> }
          <Share
            openModal = { this.props.openModal }
           />
         </div>
      </div>
    );
  }

};

export default Dashboard;
