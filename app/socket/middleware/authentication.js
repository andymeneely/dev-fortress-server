/**
 * @module socket/middleware/authentication
 */
const authLib = require('../../lib/authentication');
const teamController = require('../controllers/team');
const emitters = require('../emitters/emitters');
const has = require('has');

/**
 * Validate a given team token. If valid, update team info in redis.
 * @param {Socket} socket the socket io socket
 * @param {String} token  the team's auth token
 */
function validateTeamToken(socket, token) {
  let didSucceed;
  let message;
  const decoded = authLib.verifyToken(token);
  if (!decoded || !has(decoded, 'type') || !has(decoded, 'id') || decoded.type !== 'TEAM') {
    message = 'Could not verify token!';
    didSucceed = false;
    console.error(message);
  } else {
    message = `Socket ${socket.id} validated successfully!`;
    didSucceed = true;
    console.log(message);

    teamController.storeSocketIdTeamId(socket.id, decoded.id);
    teamController.storeUpdateTeamInfo(decoded.id);
  }
  emitters.emitInfoEventResults(socket, 'authenticate_team', didSucceed, message);
}

module.exports = {
  validateTeamToken,
};
