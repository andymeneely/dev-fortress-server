/**
 * @module socket/controllers/game
 */
const redis = require('../../redis');
const Game = require('../../models/game');

function getGamesInProgress() {
  redis.get('games_in_progress', (err, result) => {
    if (err) {
      console.error(err);
      return null;
    }
    return result;
  });
}

function storeUpdatedGameInfo(gameId, callback) {
  Game.where('id', gameId).fetch({ withRelated: ['teams', 'storyteller'] })
  .then((game) => {
    const jsonString = JSON.stringify(game.serialize());
    redis.set(`game_${gameId}`, jsonString);
    callback();
  });
}

function getGame(gameId, callback) {
  storeUpdatedGameInfo(gameId, () => {
    redis.get(`game_${gameId}`, callback);
  });
}

module.exports = {
  getGamesInProgress,
  getGame,
  storeUpdatedGameInfo,
};
