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

module.exports = {
  emitStorytellerGames,
};
