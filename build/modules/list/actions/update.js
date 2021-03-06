'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.buildUpdate = buildUpdate;

var _typed = require('error/typed');

var _typed2 = _interopRequireDefault(_typed);

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./../../../utils/schema');

var _schema2 = _interopRequireDefault(_schema);

var _setCriteria = require('./../../../utils/set-criteria');

var _setCriteria2 = _interopRequireDefault(_setCriteria);

var _convertToResponse = require('./../../../utils/convert-to-response');

var _convertToResponse2 = _interopRequireDefault(_convertToResponse);

var _pins = require('../../../pins');

var _constants = require('./../constants');

var _errors = require('../../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_INFO = { module: _constants.MODULE_NAME, action: 'update' };
const SetParamsInternalError = (0, _typed2.default)({
  message: '{name} - параметры для создания записи не корректны',
  type: 'micro.plugins.dal.schema.set-params.params.not.correct',
  code: 500
});

exports.default = (app, middleware, plugin) => msg => buildUpdate(app, middleware, msg);

function buildUpdate(app, middleware, _ref) {
  let schema = _ref.schema;
  var _ref$criteria = _ref.criteria;
  let criteria = _ref$criteria === undefined ? {} : _ref$criteria;
  var _ref$params = _ref.params;
  let params = _ref$params === undefined ? {} : _ref$params;
  var _ref$options = _ref.options;
  let options = _ref$options === undefined ? {} : _ref$options;
  const transaction = options.transaction;
  var _options$outer = options.outer;
  const outer = _options$outer === undefined ? false : _options$outer,
        fields = options.fields;

  const __fields = schema.getMyFields(fields);

  if (!params) {
    return _promise2.default.resolve(null);
  }

  if (!schema) {
    return _promise2.default.reject((0, _errors.schemaNotFoundError)(ERROR_INFO));
  }

  if (!(schema instanceof _schema2.default)) {
    return _promise2.default.reject((0, _errors.schemaNotInstanceSchemaClassError)(ERROR_INFO));
  }

  return new _promise2.default((resolve, reject) => {
    criteria = schema.getMyCriteriaParams(criteria);

    if ((0, _lodash2.default)(criteria)) {
      return resolve(null);
    }

    // Узнаем кол-во обновляемых строк
    app.act((0, _extends3.default)({}, _pins.PIN_LIST_COUNTS, { schema, criteria })).then((_ref2) => {
      let count = _ref2.count;

      // Если равно 0 - то и обновлять не стоит
      if (count === 0) {
        return null;
      }

      let __params;

      try {
        __params = schema.setParams(params);
        app.log.debug('micro.plugins.dal.update', { criteria, params: { old: params, new: __params } });
      } catch (e) {
        if (e.type === 'micro.plugins.dal.schema.validate.error') {
          return reject(e);
        }

        app.log.error(e);
        return reject(SetParamsInternalError());
      }

      if ((0, _lodash2.default)(__params)) {
        return { id: criteria.id };
      }

      let builder = (0, _setCriteria2.default)(app, middleware(schema.tableName), criteria, reject).update(__params).returning(...__fields);

      if (outer) {
        // Если кто-то сам хочет запускать запрос - вернем builder
        // Возвращаем как объект - иначе происходит исполнение данного builder'a
        return resolve({ builder });
      }

      return builder.then(result => {
        if (!result) {
          return result;
        }

        if (Array.isArray(result)) {
          return result.map((0, _convertToResponse2.default)(schema, __fields));
        }

        return (0, _convertToResponse2.default)(schema, __fields)(result);
      }).catch(error => reject((0, _errors.internalErrorPromise)(app, ERROR_INFO)(error)));
    }).then(resolve).catch(reject);
  });
}
//# sourceMappingURL=update.js.map