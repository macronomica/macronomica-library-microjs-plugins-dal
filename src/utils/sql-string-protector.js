import isString from 'lodash.isstring';

/***
 * @author Richard Hyatt
 * @email: richard@vandium.io
 * @link: http://www.vandium.io
 * @link https://github.com/vandium-io/vandium-node/blob/master/lib/plugins/protect/sql.js
 *
 * Inspired by:
 *
 * http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
 * http://www.troyhunt.com/2013/07/everything-you-wanted-to-know-about-sql.html
 * http://scottksmith.com/blog/2015/06/08/secure-node-apps-against-owasp-top-10-injection
 * http://www.unixwiz.net/techtips/sql-injection.html
 */
const SQL_ATTACKS = {

  ESCAPED_COMMENT: /((\%27)|(\'))\s*(\-\-)/i,

  ESCAPED_OR: /\w*\s*((\%27)|(\'))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,  // "value' or "

  ESCAPED_AND: /\w*\s*((\%27)|(\'))\s*((\%41)|a|(\%61))((\%4E)|n|(\%65))((\%44)|d|(\%64))/i,  // "value' and "

  EQUALS_WITH_COMMENT: /\s*((\%3D)|(=))[^\n]*((\%27)|(\')(\-\-)|(\%3B)|(;))/i,       // "= value 'sql_command" or "= value';sql_command"

  ESCAPED_SEMICOLON: /\w*\s*((\%27)|(\'))\s*((\%3B)|(;))/i,                          // "value';

  ESCAPED_UNION: /\w*\s*((\%27)|(\'))\s*union/i
};
const SQL_ATTACKS_NAME = Object.keys(SQL_ATTACKS);

export default (value) => scan(value);

function scan(value) {
  if (isString(value)) {

    for (var i = 0; i < SQL_ATTACKS_NAME.length; i++) {

      var attackName = SQL_ATTACKS_NAME[ i ];

      var regex = SQL_ATTACKS[ attackName ];

      if (regex.test(value)) {

        return false;
      }
    }
  }

  return true;
}