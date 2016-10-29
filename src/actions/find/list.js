import isString from 'lodash.isstring';
import isNumber from './../../utils/is-number';
import setCriteria from './../../utils/set-criteria';
import {ERROR_FIND_LIST} from './../constants';

export default (middleware, micro, plugin) =>
  (schema, criteria = {}, options) =>
    buildFindList(middleware, schema, criteria, options);

export function buildFindList(middleware, schema, criteria = {}, options = {}) {
  let {
    sql = false,
    fields,
    sort = 'id',
    limit,
    offset,
  } = options;

  return new Promise((resolve, reject) => {
    let builder = setCriteria(
      middleware(schema.tableName),
      schema.getMyParams(criteria),
      reject
    ).select(...schema.getMyFields(fields));

    if (sort) {
      let orderKey;
      let orderDirection;

      if (isString(sort)) {
        sort = sort.split(' ');

        if (sort.length === 2) {
          orderKey = sort[ 0 ];
          orderDirection = [ 'asc', 'desc' ].includes(sort[ 1 ].toLowerCase())
            ? sort[ 1 ].toLowerCase()
            : 'asc';
        } else {
          orderKey = sort;
          orderDirection = 'asc';
        }
      }

      if (orderKey && orderDirection) {
        builder = builder.orderBy(orderKey, orderDirection);
      }
    }

    if (limit && isNumber(limit)) {
      builder = builder.limit(limit);
    }

    if (offset && isNumber(offset)) {
      builder = builder.offset(offset);
    }

    if (sql) {
      resolve(builder.toSQL());
    } else {
      builder
        .then((result = []) => resolve(result.map(row => ({ ...row }))))
        .catch(error => {
          reject({
            code   : ERROR_FIND_LIST,
            message: error.detail || error.message.split(' - ')[ 1 ]
          });
        });
    }
  });
}