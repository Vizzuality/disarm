'use strict';

import Backbone from 'backbone';
const conf = require('./../config.json');

class ChartCollection extends Backbone.Collection {

	_getUrl(query) {
		return `https://${conf.cartodb.user_name}.cartodb.com/api/v2/sql?q=${query}`;
	}

	getMonthCases(month) {
		const query = `SELECT date, count(cartodb_id) as cases FROM cases2015 WHERE month = ${month} GROUP BY date`
		const url = this._getUrl(query);	
		return this.fetch({url});
	}

	getMaxCases() {
		const query = `with t as (SELECT date, count(cartodb_id) as cases FROM cases2015 GROUP BY date)
		SELECT max(cases) as maxCases FROM t`
		const url = this._getUrl(query);	
		return this.fetch({url});
	}
}

export default new ChartCollection();