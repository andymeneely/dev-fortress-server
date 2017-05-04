/**
 * @module socket/controllers/room
 */
const emitters = require('../emitters');
/**
 * Join a socket to a room.
 * @param {Socket.io} socket the client socket
 * @param {String} room the name of the room to join
 */
function joinRoom(socket, room, callback) {
  socket.join(room);
  emitters.generalEmitters.emitInfoEventResults(socket, 'join_game_room', true, `You've joined room: ${room}`);
  emitters.generalEmitters.emitInfoFromSocketToRoom(socket, 'join_game_room', true, `Socket ${socket.id} has entered the room`, room);
  callback();
}

/**
 * Join a socket to the room specified by 'gameId'.
 * @param {Socket.io} socket the client socket
 * @param {Integer}   gameId the id of the Game room to join
 */
function joinGameRoom(socket, gameId, callback) {
  joinRoom(socket, `game_${gameId}`, callback);
}

module.exports = {
  joinRoom,
  joinGameRoom,
};
