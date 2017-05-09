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

// function for a storyteller to start a game
function startGame(gameId, callback) {
  // Game.where('id', gameId).fetch().then(() => {
  //   new Game({ id: gameId }).save({
  //     round_phase: 0,
  //     current_round: 1,
  //   }, { patch: true }).then(updateGameInfo(gameId, callback));
  // });
}

// function for Storyteller to advance a Round
function nextRound(gameId, callback) {
  Game.where('id', gameId).fetch().then((game) => {
    const newRound = game.attributes.current_round + 1;
    new Game({ id: gameId }).save({
      round_phase: 0,
      current_round: newRound,
    }, { patch: true }).then(updateGameInfo(gameId, callback));
  });
}

module.exports = {
  updateGameInfo,
  getGamesByStorytellerId,
  getGameById,
  startGame,
  nextRound,
};
