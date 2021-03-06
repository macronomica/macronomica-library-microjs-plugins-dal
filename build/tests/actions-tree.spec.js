'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _microjs = require('@microjs/microjs');

var _microjs2 = _interopRequireDefault(_microjs);

var _constants = require('./constants');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const should = _chai2.default.should();
const micro = (0, _microjs2.default)({
  level: _microjs.LEVEL_ERROR,
  plugins: [(0, _index2.default)(_constants.CONNECT_OPTIONS)]
});
const tableName = 'module-tree-db';

const schema = new _index.Schema('TreeNode', {
  parentId: {
    type: _index.SchemaTypes.number,
    null: true
  },
  leaf: {
    type: _index.SchemaTypes.boolean,
    default: true
  },
  name: {
    type: _index.SchemaTypes.string,
    max: 128,
    trim: true
  }
}, { tableName });

before(() => micro.run().then(() => micro.act(_index.PIN_CONNECTION)).then(createTable));
after(() => micro.act(_index.PIN_CONNECTION).then(dropTable).then(() => micro.end()));

describe('actions-tree', function () {

  it('ping', () => micro.act('cmd:ping').then(result => should.equal(result, 'pong')));

  it('create', () => {
    let root;
    let child;

    return createNode({ name: 'node-root' }).then(result => _promise2.default.all([root = result, should.exist(result), result.should.be.a('object'), result.should.have.property('id'), result.id.should.be.a('number')])).then(() => findOne(root.id)).then(result => _promise2.default.all([should.exist(result), result.should.have.property('leaf').be.a('boolean').equal(true)])).then(() => createNode({ parentId: root.id, name: 'node-child-1' })).then(result => _promise2.default.all([child = result, should.exist(result), result.should.be.a('object'), result.should.have.property('id'), result.id.should.be.a('number')]).then(() => result)).then(result => _promise2.default.all([findOne(root.id), findOne(result.id)])).then((_ref) => {
      var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

      let root = _ref2[0],
          child = _ref2[1];
      return _promise2.default.all([should.exist(root), should.exist(child), root.should.have.property('leaf').be.a('boolean').equal(false), child.should.have.property('leaf').be.a('boolean').equal(true)]);
    }).then(() => _promise2.default.all([removeNode(root.id), removeNode(child.id)]));
  });

  it('update', () => {
    let roots;
    let child;

    return _promise2.default.all([createNode({ name: 'node-root-1' }), createNode({ name: 'node-root-2' })]).then(result => roots = result).then(roots => createNode({ parentId: roots[0].id, name: 'node-child-1' }).then(child => updateNode(child.id, { parentId: roots[1].id }).then(() => _promise2.default.all([findOne(roots[0].id), findOne(roots[1].id), findOne(child.id)]).then((_ref3) => {
      var _ref4 = (0, _slicedToArray3.default)(_ref3, 3);

      let root1 = _ref4[0],
          root2 = _ref4[1],
          child = _ref4[2];
      return _promise2.default.all([should.exist(root1), should.exist(root2), should.exist(child), root1.should.have.property('leaf').equal(true), root2.should.have.property('leaf').equal(false), child.should.have.property('leaf').equal(true), child.should.have.property('parentId').not.equal(root1.id), child.should.have.property('parentId').equal(root2.id)]);
    })).then(result => _promise2.default.all([removeNode(roots[0].id), removeNode(roots[1].id), removeNode(child.id)]))));
  });

  it('find path', () => createNode({ name: 'node-root-1' }).then(root => createNode({ parentId: root.id, name: 'node-child-1' }).then(child1 => createNode({ parentId: child1.id, name: 'node-child-2' }).then(child2 => _promise2.default.all([findPath(), findPath(child1.id), findPath(child2.id)]).then((_ref5) => {
    var _ref6 = (0, _slicedToArray3.default)(_ref5, 3);

    let rootPath = _ref6[0],
        child1Path = _ref6[1],
        child2Path = _ref6[2];
    return _promise2.default.all([rootPath.should.with.length(0), child1Path.should.with.length(1), child2Path.should.with.length(2)]).then(() => _promise2.default.all([removeNode(root.id), removeNode(child1.id), removeNode(child2.id)]));
  })))));

  it('find parents', () => createNode({ name: 'node-root-1' }).then(root => createNode({ parentId: root.id, name: 'node-child-1' }).then(child1 => createNode({ parentId: root.id, name: 'node-child-1' }).then(child2 => _promise2.default.all([findByParentId(), findByParentId(root.id), findByParentId(child1.id), findByParentId(child2.id)]).then((_ref7) => {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 4);

    let list1 = _ref8[0],
        list2 = _ref8[1],
        list3 = _ref8[2],
        list4 = _ref8[3];
    return _promise2.default.all([list1.should.with.length(1), list2.should.with.length(2), list3.should.with.length(0), list4.should.with.length(0)]).then(() => _promise2.default.all([removeNode(root.id), removeNode(child1.id), removeNode(child2.id)]));
  })))));

  it('remove', () => createNode({ name: 'node-root-1' }).then(root => removeNode(root.id)));
});

function createTable(connection) {
  return connection.schema.createTableIfNotExists(schema.tableName, function (table) {
    table.increments();
    table.integer('parentId').nullable();
    table.boolean('leaf').defaultTo(schema.properties.leaf.default);
    table.string('name');
  });
}

function dropTable(connection) {
  return connection.schema.dropTableIfExists(schema.tableName);
}

function removeNode(id) {
  return micro.act((0, _extends3.default)({}, _index.PIN_TREE_REMOVE, {
    schema,
    criteria: { id }
  }));
}

function updateNode(id, params) {
  return micro.act((0, _extends3.default)({}, _index.PIN_TREE_UPDATE, {
    schema,
    criteria: { id },
    params
  }));
}

function createNode() {
  let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return micro.act((0, _extends3.default)({}, _index.PIN_TREE_CREATE, {
    schema,
    params
  }));
}

function findPath(id) {
  return micro.act((0, _extends3.default)({}, _index.PIN_TREE_FIND_PATH, {
    schema,
    criteria: { id }
  }));
}

function findByParentId(parentId) {
  return micro.act((0, _extends3.default)({}, _index.PIN_TREE_FIND_PARENT_id, {
    schema,
    criteria: { parentId }
  }));
}

function findOne(id) {
  let fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['id', 'parentId', 'leaf', 'name'];

  return micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields }
  }));
}

function findFull(id) {
  return micro.act((0, _extends3.default)({}, _index.PIN_LIST_FIND_ONE, {
    schema,
    criteria: { id },
    options: { fields: ['id', 'parentId', 'leaf', 'name'] }
  }));
}
//# sourceMappingURL=actions-tree.spec.js.map