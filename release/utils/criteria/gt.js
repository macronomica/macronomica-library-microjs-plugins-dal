'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KEY = exports.KEY = 'gt';

/**
 * @param {object} builder
 * @param {string} property
 * @param {*} value
 * @returns {*}
 */

exports.default = function (builder, property, value) {
  return builder.where(property, '>', value);
};
//# sourceMappingURL=gt.js.map
