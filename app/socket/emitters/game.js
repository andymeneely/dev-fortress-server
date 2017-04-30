/**
 * @module /socket/emitters/game
 */
const generalEmitters = require('./general');

function emitGameUpdate(game) {
  generalEmitters.emitToRoom(`game_${game.id}`, 'game_info', game);
}

module.exports = {
  emitGameUpdate,
};
