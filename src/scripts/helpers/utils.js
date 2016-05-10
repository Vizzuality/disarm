'use strict';

import $ from 'jquery';

function checkDevice() {
  const mobileWidth = 640;
  const tableWidth = 767;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const width = $(document).width();
  const isMobile = width <= mobileWidth;
  const isTablet = (!isMobile && width <= tableWidth);
  const isDevice = mobileRegex.test(navigator.userAgent);
  return {
    mobile: isMobile,
    tablet: isTablet,
    device: isDevice
  };
}

/* Polyfill for the matches DOM API method (IE 9+)
 * Source: http://youmightnotneedjquery.com */
function matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

function pad(number, times, char) {
	let str = number + '';
	while(str.length < times) str = char + str;
	return str;
}

/* Return true if the two passed ranges intersect, optionally a compare method
 * can be passed */
function rangesIntersect(range1, range2, compareFunc) {
  const compare = compareFunc || ((a, b) => a - b);
  const minRange = compare(range1[0], range2[0]) < 0 ? range1 : range2;
  const maxRange = minRange === range1 ? range2 : range1;
  return compare(minRange[1], maxRange[0]) > 0;
}

function numberNotation(number) {
  if (!isNaN(parseFloat(number))) {

    if (number % 1 != 0) {

      if (parseInt(number).toString().length > 3) {
        return parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
        return parseFloat(number).toFixed(2);
      }

    } else {

      if (parseInt(number).toString().length > 3) {
        var d = parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return d.split('.')[0];
      }
    }
  }

  return number;
}

/* Polyfill for Object.assign
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

export default {
  checkDevice,
  matches,
  pad,
  rangesIntersect,
  numberNotation
};
