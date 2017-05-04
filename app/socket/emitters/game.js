/**
 * @module /socket/emitters/game
 */
const generalEmitters = require('./general');

/**
 * Emit the state of a game model to a game room's 'game_info' channel.
 * @param {JSON} game the game model to emit
 */
function emitGameUpdate(game) {
  generalEmitters.emitToRoom(`game_${game.id}`, 'game_info', game);
}

module.exports = {
  emitGameUpdate,
};
