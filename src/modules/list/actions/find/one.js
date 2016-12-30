import dot from 'dot-object';
import isEmpty from 'lodash.isempty';
import Schema from './../../../../utils/schema';
import setCriteria from './../../../../utils/set-criteria';
import checkLinks from './../../../../utils/check-links';
import convertToResponse from './../../../../utils/convert-to-response';
import { MODULE_NAME } from './../../constants';
import {
  internalErrorPromise,
  schemaNotFoundError,
  schemaNotInstanceSchemaClassError
} from '../../../../errors';

const ERROR_INFO = { module: MODULE_NAME, action: 'find-one' };

export default (app, middleware, plugin) => (msg) => buildFindOne(app, middleware, msg);

export function buildFindOne(app, middleware, msg) {
  let { schema, criteria = {}, options = {} } = msg;
  const { transaction, outer = false, fields } = options;

  if (!schema) {
    return Promise.reject(schemaNotFoundError(ERROR_INFO));
  }

  if (!(schema instanceof Schema)) {
    return Promise.reject(schemaNotInstanceSchemaClassError(ERROR_INFO));
  }

  return new Promise((resolve, reject) => {
    let __fields = schema.getMyFields(fields);
    criteria = schema.getMyCriteriaParams(criteria);

    if (isEmpty(criteria)) {
      return resolve(null);
    }

    let builder = setCriteria(app, middleware(schema.tableName), criteria, reject)
      .select(...__fields)
      .limit(1);

    if (outer) {
      // Если кто-то сам хочет запускать запрос - вернем builder
      // Возвращаем как объект - иначе происходит исполнение данного builder'a
      return resolve({ builder });
    }

    // Иначе вызовем его выполнение
    builder
      .then(([ result ]) => new Promise(async resolve => {
        if (!result) {
          return resolve(result);
        }

        const record = convertToResponse(schema, __fields)(result);

        resolve(await loadAndAssignLink(msg, schema, record));
      }))
      .then(resolve)
      .catch(internalErrorPromise(app, ERROR_INFO))
      .catch(reject);
  });
}

function loadAndAssignLink(msg, schema, record) {
  const links = checkLinks('one', schema.properties);

  if (!links.keys.length) {
    return Promise.resolve(record);
  }

  // Получаем все связанные объекты и сетим их себе
  return Promise
    .all(links.keys.map(propertyName => msg
      .act({ ...links[ propertyName ], criteria: { id: dot.pick(propertyName, record) } })
      .then(link =>
        Object.assign(record[ propertyName.slice(0, propertyName.lastIndexOf('.')) ], link)
      ))
    )
    .then(() => record);
}