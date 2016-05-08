'use strict';

import './styles.postcss';
import React from 'react';

class Chart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div ref="ChartElement" className="c-chart">
        <p>Hello from chart component.</p>
      </div>
    );
  }
};

export default Chart;
