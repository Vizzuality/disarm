'use strict';

import './styles.postcss';

import React from 'react';
import InfoWindow from '../../Infowindow';

class TableInfoWindow extends InfoWindow {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden,
      content: this._getContent()
    };
  }

  _getContent() {
    return(
      <div className="c-table">
        <h2>Table View</h2>
        <table>
          <thead>
            <tr>
              <th>village</th>
              <th>risk level</th>
              <th>number of cases reported</th>
            </tr>
          </thead>
          <tbody>

            <tr></tr>
            <tr></tr>
            <tr></tr>

          </tbody>
        </table>

        <div className="table-buttons">
          <button className="btn -gray -disabled">save</button>
          <button className="btn -gray">print</button>
        </div>
      </div>
    );
  }

  render() {
    return super.render();
  }

};

export default TableInfoWindow;
