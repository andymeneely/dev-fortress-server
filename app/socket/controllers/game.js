/**
 * @module socket/controllers/game
 */
const redis = require('../../redis');
const Game = require('../../models/game');
const emitters = require('../emitters');

/**
 * Store the json string representation of a game model to redis.
 * @param {JSON}     game     the game model as a JSON object
 * @param {Function} callback the function to call once complete
 */
function storeGameInfo(game, callback) {
  const jsonString = JSON.stringify(game);
  redis.set(`game_${game.id}`, jsonString, () => {
    emitters.gameEmitters.emitGameUpdate(game);
    callback();
  });
}

/**
 * Update Redis with the latest Game info from the Model
 * @param {Integer} gameId the id of the Game
 * @param {Function} callback the callback function
 */
function updateGameInfo(gameId, callback) {
  Game.where('id', gameId).fetch({ withRelated: ['teams', 'storyteller'] })
  .then((game) => {
    storeGameInfo(game.serialize(), callback);
  });
}

/**
 * Retreive a collection of Games for a given storyteller ID
 * @param {Integer}  storytellerId the id of the storyteller
 * @param {Function} callback the function to forward the collection of game models to.
 */
function getGamesByStorytellerId(storytellerId, callback) {
  Game.where('storyteller_id', storytellerId).fetchAll({ withRelated: ['teams', 'storyteller'] })
  .then((games) => {
    callback(games.serialize());
  });
}

/**
 * Retrieve a game model from redis.
 * @param {Integer} gameId    the id of the Game model
 * @param {Function} callback the function to which the game model is passed.
 */
function getGameById(gameId, callback) {
  // redis.get(`game_${gameId}`, callback);
  Game.where('id', gameId).fetch().then((game) => {
    callback(game.serialize());
  });
}

// function for Storyteller to advance a Round
function nextRound(gameId, callback) {
  redis.set(`game_${gameId}_pending_actions`, JSON.stringify({}));
  Game.where('id', gameId).fetch().then((game) => {
    const newRound = game.attributes.current_round + 1;
    new Game({ id: gameId }).save({
      round_phase: 0,
      current_round: newRound,
    }, { patch: true }).then(updateGameInfo(gameId, callback));
  });
}

/**
 * Advance to the next phase for the current round.
 * @param {Number} gameId the ID of the game to advance the phase of.
 * @param {Function} callback the callback function to call when the operation is complete.
 */
function nextPhase(gameId, callback) {
  Game.where('id', gameId).fetch().then((game) => {
    const newPhase = game.attributes.round_phase === 3 ? 0 : game.attributes.round_phase + 1;
    new Game({ id: gameId }).save({
      round_phase: newPhase,
    }, { patch: true }).then(updateGameInfo(gameId, callback));
  });
}

// function for a storyteller to start a game
function startGame(gameId, callback) {
  Game.where('id', gameId).fetch().then((game) => {
    if (game.attributes.current_round === 0) {
      nextRound(gameId, callback);
    }
  });
}

/**
 * Retrieve the rumor queue array for a specific game.
 * @param {Number} gameId the ID of the game for the rumor queue
 * @param {Function} callback the callback function to pass the rumor queue array to
 */
function getRumorQueue(gameId, callback) {
  redis.get(`game_${gameId}_rumor_queue`, (err, rumorQueueString) => {
    if (rumorQueueString !== null) callback(JSON.parse(rumorQueueString));
    else callback([]);
  });
}

/**
 * Update the rumor queue for a specific game.
 * @param {Number} gameId the ID of the Game for the rumor queue
 * @param {Number[]} rumorQueue collection of rumor IDs
 * @param {Function} callback the callback function after execution is complete
 */
function updateRumorQueue(socket, gameId, rumorQueue, callback) {
  redis.set(`game_${gameId}_rumor_queue`, JSON.stringify(rumorQueue));
  emitters.storytellerEmitters.emitRumorQueueUpdate(socket, gameId, rumorQueue);
  callback();
}

module.exports = {
  updateGameInfo,
  getGamesByStorytellerId,
  getGameById,
  startGame,
  nextRound,
  nextPhase,
  getRumorQueue,
  updateRumorQueue,
};
