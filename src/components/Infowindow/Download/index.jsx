'use strict';

import './styles.postcss';

import React from 'react';
import InfoWindow from '../../Infowindow';

class DownloadInfoWindow extends InfoWindow {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden,
      content: this._getContent()
    };
  }

  _onSubmit(e) {
    e.preventDefault();
    console.log('submit!');
  }

  _getContent() {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 'july',
      'august', 'september', 'october', 'november', 'december'
    ];

    const monthsNodes = months.map((month, i) => {
      return <label className="form-item" key={i} htmlFor={i}><input type='checkbox' value={i} />{month}</label>;
    });

    return(
      <div className="c-download">
        <h2>print map</h2>
        <form action="" onSubmit={this._onSubmit}>
          <div className="form-params">
            <div className="formats">
              <label for="csv" className="form-item"><input defaultChecked type="radio" name="format" defaultValue="csv" /> csv</label>
              <label for="json" className="form-item" ><input type="radio" name="format" defaultValue="json" /> json</label>
              <label for="other" className="form-item"><input type="radio" name="format" defaultValue="other" /> other</label>
            </div>
            <div className="months">
              {monthsNodes}
            </div>
          </div>

          <div className="form-buttons">
            <input defaultValue="save" type="submit" className="btn -gray -disabled" />
            <button className="btn -gray">print</button>
          </div>

        </form>

      </div>
    );
  }

  render() {
    return super.render();
  }

}

export default DownloadInfoWindow;
