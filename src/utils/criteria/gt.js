export const KEY = 'gt';

/**
 * @param {object} builder
 * @param {string} property
 * @param {*} value
 * @returns {*}
 */
export default (builder, property, value) => {
  return builder.where(property, '>', value);
};