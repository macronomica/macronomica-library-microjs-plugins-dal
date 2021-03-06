'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (name, properties) => {
  const keys = (0, _keys2.default)(properties);
  const result = { keys: [] };

  for (let key of keys) {
    let property = properties[key];
    if (!('link' in property) || !(name in property.link)) {
      continue;
    }
    result.keys.push(key);
    result[key] = property.link[name];
  }

  return result;
};
//# sourceMappingURL=check-links.js.map