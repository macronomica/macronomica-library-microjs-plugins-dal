'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _microjs = require('@microjs/microjs');

var _microjs2 = _interopRequireDefault(_microjs);

var _constants = require('./constants');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tableName = 'module_list_db';
const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS_PG)]
});

const schema = new _index.Schema('UserInfo', {
  userId: {
    type: _index.SchemaTypes.number,
    unique: true,
    description: 'Идентификатор пользователя'
  },
  login: {
    type: _index.SchemaTypes.string,
    max: 128,
    trim: true,
    unique: true,
    description: 'Уникальный логин (email) для входа'
  }
}, { tableName });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable));
after(() => micro.end());

describe('actions-list', function () {
  let model;

  it('#ping', () => micro.act('cmd:ping').then(result => should.equal(result, 'pong')));

  it('#create return { id }', () => micro.act(_extends({}, _index.PIN_LIST_CREATE, { schema, params: { userId: 1, login: 'test' } })).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id'), result.id.should.be.a('number')]).then(() => result)).then(result => findFull(result.id).then(result => model = result)));

  it('#create return [{ id }, { id }]', () => micro.act(_extends({}, _index.PIN_LIST_CREATE, { schema, params: [{ userId: 111, login: 'test111' }, { userId: 2222, login: 'test2222' }] })).then(result => Promise.all([console.log(result), should.exist(result), result.should.be.a('array').with.length(2)]).then(() => result)).then(result => findFull(result.id).then(result => model = result)));

  it('#find-one return { id, userId, login }', () => findFull(model.id).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id), result.should.have.property('userId').be.a('number').equal(model.userId), result.should.have.property('login').be.a('string').equal(model.login)])));

  it('#find-one return { id }', () => micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, { schema, criteria: { id: model.id } })).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id), result.should.not.have.property('userId'), result.should.not.have.property('login')])));

  it('#find-list return [{ id }]', () => micro.act(_extends({}, _index.PIN_LIST_FIND_LIST, { schema })).then(result => Promise.all([should.exist(result), result.should.be.a('array').with.length(1), result[0].should.be.a('object'), result[0].should.have.property('id').be.a('number').equal(model.id), result[0].should.not.have.property('userId'), result[0].should.not.have.property('login')])));

  it('#update update property login', () => micro.act(_extends({}, _index.PIN_LIST_UPDATE, {
    schema,
    criteria: { id: model.id },
    params: { login: 'login2' }
  })).then(() => findFull(model.id)).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').equal(model.id), result.should.have.property('login').not.equal(model.login), result.should.have.property('login').equal('login2'), result.should.have.property('userId').equal(model.userId)]).then(() => model = result)));

  it('#update update property login, userId', () => micro.act(_extends({}, _index.PIN_LIST_UPDATE, {
    schema,
    criteria: { id: model.id },
    params: { login: 'login3', userId: 2 }
  })).then(() => findFull(model.id)).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').equal(model.id), result.should.have.property('login').not.equal(model.login), result.should.have.property('login').equal('login3'), result.should.have.property('userId').not.equal(model.userId), result.should.have.property('userId').equal(2)]).then(() => model = result)));

  it('#remove return { id }', () => micro.act(_extends({}, _index.PIN_LIST_REMOVE, { schema, criteria: { id: model.id } })).then(result => Promise.all([should.exist(result), result.should.be.a('object'), result.should.have.property('id').be.a('number').equal(model.id)])));

  it('#find-one should return null', () => micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, { schema, criteria: { id: model.id } })).then(result => should.not.exist(result)));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(tableName, function (table) {
    table.increments();
    table.integer('userId');
    table.string('login');
    table.unique(['userId', 'login']);
  });
}

function findFull(id) {
  return micro.act(_extends({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'userId', 'login'] }
  }));
}
//# sourceMappingURL=actions-list.spec.js.map