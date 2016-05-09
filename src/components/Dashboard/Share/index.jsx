'use strict';

import './styles.postcss';

import React from 'react';

class Share extends React.Component {

  constructor(props) {
    super(props);
  }

  _onPrint() {
    window.print();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="c-share">
        <button onClick={this.props.openModal.bind(this, 'downloadInfoWindow')} id="btn-download" className="btn">download</button>
        <button onClick={this._onPrint} className="btn">print</button>
        <button onClick={this.props.openModal.bind(this, 'tableInfoWindow')} id="btn-table" className="btn">table</button>
      </div>
    );
  }

};

export default Share;
