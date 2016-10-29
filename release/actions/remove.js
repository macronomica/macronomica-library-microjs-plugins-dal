'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRemove = buildRemove;

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _setCriteria = require('./../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middleware, micro, plugin) {
  return function (schema, params, options) {
    return buildRemove(middleware, schema, params, options);
  };
};

function buildRemove(middleware, schema) {
  var criteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$sql = _ref.sql,
      sql = _ref$sql === undefined ? false : _ref$sql;

  return new Promise(function (resolve, reject) {
    criteria = schema.getMyParams(criteria);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    var table = middleware(schema.tableName);
    var builder = (0, _setCriteria2.default)(table, criteria, reject).del();

    if (sql) {
      return resolve(builder.toSQL());
    }

    builder.then(resolve).catch(function (error) {
      reject({
        code: _constants.ERROR_REMOVE,
        message: error.detail
      });
    });
  });
}
//# sourceMappingURL=remove.js.map
