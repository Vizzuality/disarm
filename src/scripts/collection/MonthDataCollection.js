'use strict';

import Backbone from 'backbone';

class MonthDataCollection extends Backbone.Collection {
};

MonthDataCollection.prototype.url = 'dist/chart-data.json';

export default MonthDataCollection;
