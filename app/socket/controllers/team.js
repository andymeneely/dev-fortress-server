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
function updateTeamInfo(socket, callback) {
  redis.get(socket.id).then((teamId) => {
    Team.where('id', teamId).fetch({ withRelated: ['teamtype'] })
      .then((team) => {
        const jsonString = JSON.stringify(team.serialize());
        redis.set(`team_${team.id}`, jsonString, callback);
      });
  });
}

/**
 * Get the Team associated with the socket, forward to the callback.
 * @param {Socket} socket the socket.io socket
 * @param {Function} callback the callback
 */
function getTeamJSON(socket, callback) {
  redis.get(socket.id).then((teamId) => {
    redis.get(`team_${teamId}`).then((team) => {
      const teamJSON = JSON.parse(team);
      console.log(teamJSON);
      callback(teamJSON);
    });
  });
}

/**
 * Store the socketid/teamid association.
 * @param {Integer} socketId the socket
 * @param {Integer} teamId the id of the team
 */
function storeSocketIdTeamId(socket, teamId, callback) {
  const socketId = socket.id;
  const teamID = teamId;
  redis.set(socketId, teamID);
  callback(teamId);
}

/**
 * Join the socket to its associated Game.
 * @param {Socket} socket the socket.io socket
 */
function joinGameRoom(socket, callback) {
  getTeamJSON(socket, (team) => {
    roomController.joinGameRoom(socket, team.game_id, callback);
  });
}

module.exports = {
  updateTeamInfo,
  storeSocketIdTeamId,
  getTeamJSON,
  joinGameRoom,
};
