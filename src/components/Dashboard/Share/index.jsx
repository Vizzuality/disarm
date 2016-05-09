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

  render() {
    return (
      <div className="c-share">
        <button id="btn-download" class="btn -download">download</button>
        <button onClick={this._onPrint} class="btn -print">print</button>
        <button id="btn-table" class="btn -table">table</button>
      </div>
    );
  }

};

export default Share;
