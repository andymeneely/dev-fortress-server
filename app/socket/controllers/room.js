/**
 * @module socket/controllers/room
 */
// const emitters = require('../emitters');
const generalEmitters = require('../emitters/general');

/**
 * Join a socket to a room.
 * @param {Socket} socket the socket.io socket
 * @param {String} room the room to join
 */
function joinRoom(socket, room, callback) {
  socket.join(room);
  generalEmitters.emitInfoEventResults(socket, 'join room', true, `You've joined room: ${room}`);
  generalEmitters.emitInfoFromSocketToRoom(socket, 'join room', true, `Socket ${socket.id} has entered the room`, room);
  callback();
}

function joinGameRoom(socket, gameId, callback) {
  joinRoom(socket, `game_${gameId}`, callback);
}

module.exports = {
  joinRoom,
  joinGameRoom,
};
