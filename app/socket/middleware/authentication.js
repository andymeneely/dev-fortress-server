/**
 * @module socket/middleware/authentication
 */
const authLib = require('../../lib/authentication');
const teamController = require('../controllers/team');
const has = require('has');

/**
 * Validate a given team token. If valid, update team info in redis.
 * @param {Socket} socket the socket io socket
 * @param {String} token  the team's auth token
 */
function validateTeamToken(socket, token) {
  const decoded = authLib.verifyToken(token);
  if (!decoded || !has(decoded, 'type') || !has(decoded, 'id') || decoded.type !== 'TEAM') {
    socket.emit('error', 'Could not verify token!');
    console.error('Could not verify token!');
  } else {
    console.log(`Socket ${socket.id} validated successfully!`);
    teamController.storeSocketIdTeamId(socket.id, decoded.id);
    teamController.storeUpdateTeamInfo(decoded.id);
  }
}

module.exports = {
  validateTeamToken,
};
