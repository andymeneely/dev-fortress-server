/**
 * @module /socket/emitters/storyteller
 */
const generalEmitters = require('./general');

function emitStorytellerGames(socket, gamesList) {
  generalEmitters.emitToSocket(socket, 'games_list', gamesList);
}

module.exports = {
  emitStorytellerGames,
};
