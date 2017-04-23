/**
 * @module socket/middleware/authentication
 */
const authLib = require('../../lib/authentication');
const emitters = require('../emitters/emitters');
const has = require('has');

/**
 * Validate a given team token.
 * @param {Socket} socket the socket io socket
 * @param {String} token  the team's auth token
 */
function validateTeamToken(socket, token, next) {
  let message;
  let didSucceed;
  authLib.verifyToken(token, (err, decoded) => {
    if (err || !decoded || !has(decoded, 'type') || !has(decoded, 'id') || decoded.type !== 'TEAM') {
      message = 'Could not verify token!';
      didSucceed = false;
    } else {
      message = `Team ${decoded.id} has authenticated successfully!`;
      didSucceed = true;
    }
    emitters.emitInfoEventResults(socket, 'authentication', didSucceed, message);
    if (didSucceed) next();
  });
}

module.exports = {
  validateTeamToken,
};
