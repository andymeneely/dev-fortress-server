/**
 * @module /socket/emitters/storyteller
 */
const generalEmitters = require('./general');

/**
 * Emits a list of all Games the storyteller owns.
 * Response emit: ('games_list', [...game])
 * @param socket the storyteller client socket
 */
function emitStorytellerGames(socket, gamesList) {
  generalEmitters.emitToSocket(socket, 'games_list', gamesList);
}

/**
 * Emit rumor queue updates to the requesting Socket.
 * @param {Socket.io} socket the Storyteller socket to emit to.
 * @param {Integer} gameId the ID of the Game
 * @param {JSON} rumorQueue keys: game_id, rumor_queue
 */
function emitRumorQueueUpdate(socket, gameId, rumorQueue) {
  const rumorQueueJson = {};
  rumorQueueJson.game_id = gameId;
  rumorQueueJson.rumor_queue = rumorQueue;
  generalEmitters.emitToSocket(socket, 'rumor_queue', rumorQueueJson);
}

module.exports = {
  emitStorytellerGames,
  emitRumorQueueUpdate,
};
