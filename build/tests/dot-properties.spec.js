'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _microjs = require('@microjs/microjs');

var _microjs2 = _interopRequireDefault(_microjs);

var _constants = require('./constants');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tableName = 'module_list_dot_db';
const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS_PG)]
});

const schema = new _index.Schema('UserInfo', {
  'price.nds': {
    type: _index.SchemaTypes.boolean,
    default: true,
    required: true
  },
  'dot.property1': {
    type: _index.SchemaTypes.number,
    description: 'Свойство записанное через точку'
  },
  'dot.property2': {
    type: _index.SchemaTypes.number,
    description: 'Свойство записанное через точку'
  }
}, { tableName });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable));
after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('dot-properties', function () {
  let model;

  it('#ping', () => micro.act('cmd:ping').then(result => should.equal(result, 'pong')));

  it('#create return { id }', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_CREATE, { schema, params: {
      price: { nds: true },
      dot: { property: 1, property1: 1, property2: 2 },
      customProp: true
    } })).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id'), result.id.should.be.a('number')]).then(() => result)).then(result => findFull(result.id).then(result => model = result)));

  it('#find-one return { id, dot: { property1, property2 } }', () => findFull(model.id).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id), result.should.have.property('price').property('nds').be.a('boolean').equal(model.price.nds), result.should.have.property('dot').property('property1').be.a('number').equal(model.dot.property1), result.should.have.property('dot').property('property2').be.a('number').equal(model.dot.property2)])));

  it('#update update property "dot.property1"', () => micro.act((0, _extends3.default)({}, _index.PIN_LIST_UPDATE, {
    schema,
    criteria: { id: model.id },
    params: { dot: { property1: 2 }, price: { nds: false } }
  })).then(() => findFull(model.id)).then(result => _promise2.default.all([should.exist(result), result.should.be.a('object'), result.should.have.property('price').property('nds').be.a('boolean').equal(false), result.should.have.property('dot').property('property1').not.equal(model.dot.property1), result.should.have.property('dot').property('property1').equal(2)]).then(() => model = result)));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.boolean(schema.properties['price.nds'].dbName);
    table.integer(schema.properties['dot.property1'].dbName);
    table.integer(schema.properties['dot.property2'].dbName);
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(tableName);
}

function findFull(id) {
  return micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: 'full' }
  }));
}
//# sourceMappingURL=dot-properties.spec.js.map