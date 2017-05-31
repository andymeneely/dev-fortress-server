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

/**
 * Emit pending action selections.
 * @param {Integer} gameId the ID of the Game
 * @param {JSON} pendingActions keys: team IDs; values: arrays of Action ID's
 */
function emitPendingActionsUpdate(gameId, pendingActions) {
  generalEmitters.emitToRoom(`game_${gameId}`, 'selected_actions_update', pendingActions);
}

module.exports = {
  emitGameUpdate,
  emitPendingActionsUpdate,
};
