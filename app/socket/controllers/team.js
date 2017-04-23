/**
 * @module /socket/controllers/team
 */
const redis = require('../../redis');
const Team = require('../../models/team');
const roomController = require('./room');

/**
 * Update Redis store with Team info.
 * @param {Integer} teamId the id of the Team
 */
function storeUpdateTeamInfo(teamId) {
  Team.where('id', teamId).fetch({ withRelated: ['teamtype'] })
    .then((team) => {
      const jsonString = JSON.stringify(team.serialize());
      redis.set(`team_${team.id}`, jsonString);
      console.log(`Team ${teamId} info updated`);
    });
}

/**
 * Store the socketid/teamid association.
 * @param {Integer} socketId the id of the socket
 * @param {Integer} teamId the id of the team
 */
function storeSocketIdTeamId(socketId, teamId) {
  redis.set(socketId, teamId);
  console.log(`Socket ${socketId} stored as Team ${teamId}`);
}

/**
 * Get the Team associated with the socket, forward to the callback.
 * @param {Socket} socket the socket.io socket
 * @param {Function} callback the callback: function(err, team)
 */
function getTeam(socket, callback) {
  redis.get(socket.id, (err, teamId) => {
    redis.get(`team_${teamId}`, callback);
  });
}

/**
 * Join the socket to its associated Game.
 * @param {Socket} socket the socket.io socket
 */
function joinGameRoom(socket) {
  getTeam(socket, (err, team) => {
    const teamJson = JSON.parse(team);
    roomController.joinRoom(socket, `game_${teamJson.game_id}`);
  });
}

module.exports = {
  storeUpdateTeamInfo,
  storeSocketIdTeamId,
  getTeam,
  joinGameRoom,
};
