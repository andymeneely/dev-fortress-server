/**
 * @module socket/controllers/game
 */
const redis = require('../../redis');
const Game = require('../../models/game');
const emitters = require('../emitters');

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

function getGamesByStorytellerId(storytellerId, callback) {
  Game.where('storyteller_id', storytellerId).fetchAll({ withRelated: ['teams', 'storyteller'] })
  .then((games) => {
    callback(games.serialize());
  });
}

function getGameById(gameId, callback) {
  redis.get(`game_${gameId}`, callback);
}

module.exports = {
  updateGameInfo,
  getGamesByStorytellerId,
  getGameById,
};
