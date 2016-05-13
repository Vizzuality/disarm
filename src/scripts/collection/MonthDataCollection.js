'use strict';

import Backbone from 'backbone';

class MonthDataCollection extends Backbone.Collection{

  url() {
    return './chart-data.json';
  }

};

export default MonthDataCollection;
