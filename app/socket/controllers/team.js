/**
 * @module /socket/controllers/team
 */
const redis = require('../../redis');
const Team = require('../../models/team');
const roomController = require('./room');
const emitters = require('../emitters');

/**
 * Retrieve the id of a Team associated with the requesting socket.
 * @param {Socket.io} socket   the client socket of the Team
 * @param {Function}  callback the function to forward the response to
 */
function getTeamId(socket, callback) {
  redis.get(socket.id).then(callback);
}

/**
 * Update Redis store with Team info.
 * @param {Integer} teamId the id of the Team
 */
function updateTeamInfo(socket, callback) {
  getTeamId(socket, (teamId) => {
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
  getTeamId(socket, (teamId) => {
    redis.get(`team_${teamId}`).then((team) => {
      const teamJSON = JSON.parse(team);
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

/**
 * Add or remove a pending actions to redis cache.
 * @param {Socket.io} socket     the client socket
 * @param {Integer}   actionId   the id of the action the team is selecting
 * @param {String}    updateType the type of update to perform: 'add' or 'remove'
 * @param {Function}  callback   the function to call when complete
 */
function updatePendingTeamAction(socket, actionId, updateType, callback) {
  if (updateType === 'remove' || updateType === 'add') {
    getTeamJSON(socket, (team) => {
      // Retrieve pending Game actions from cache
      redis.get(`game_${team.game_id}_pending_actions`).then((jsonString) => {
        let pendingActions = {};
        let teamPendingActions = [];
        let locationIndex = -1;
        if (jsonString) {
          pendingActions = JSON.parse(jsonString);
          teamPendingActions = pendingActions[team.id];
          if (teamPendingActions === undefined) teamPendingActions = [];
          locationIndex = teamPendingActions.indexOf(actionId);
        }
        // Add or remove the action
        if (locationIndex === -1 && updateType === 'add') teamPendingActions.push(actionId);
        if (locationIndex !== -1 && updateType === 'remove') teamPendingActions.splice(locationIndex, 1);

        // Update redis cache, emit updates
        pendingActions[team.id] = teamPendingActions;
        const newPendingActionsJSON = JSON.stringify(pendingActions);
        redis.set(`game_${team.game_id}_pending_actions`, newPendingActionsJSON).then(() => {
          emitters.gameEmitters.emitPendingActionsUpdate(team.game_id, pendingActions);
          callback();
        });
      });
    });
  }
}

module.exports = {
  getTeamId,
  updateTeamInfo,
  storeSocketIdTeamId,
  getTeamJSON,
  joinGameRoom,
  updatePendingTeamAction,
};
