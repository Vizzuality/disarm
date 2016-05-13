'use strict';

import Backbone from 'backbone';

class MonthDataCollection extends Backbone.Collection {
};

/*
 * We store data temporary at dist folder for production.
 * To do so, you need to tell git not to override this file there.
 *
 * Remember to change dist/chart-data.json for /chart-data.json
 * when going to production.
 */
MonthDataCollection.prototype.url = 'dist/chart-data.json';

export default new MonthDataCollection();
