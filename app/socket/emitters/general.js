/**
 * @module /socket/emitters/general
 */
// const io = require('../../io');

/**
 * Emit a message privately to a socket.
 * @param {Socket.io} socket    the client socket
 * @param {String}    eventName the event channel to emit to the room
 * @param {Any}       eventData the data to emit: String, JSON, Object, Array, Integer
 */
function emitToSocket(socket, eventName, eventData) {
  socket.emit(eventName, eventData);
}

/**
 * Emit a message to everyone in a room except the requesting socket
 * @param {Socket.io} socket the client socket
 * @param {String}    room   the room to emit the message to
 * @param {String}    eventName the event channel to emit to the room
 * @param {Any}       eventData the data to emit: String, JSON, Object, Array, Integer
 */
function emitToSocketRoom(socket, room, eventName, eventData) {
  socket.to(room).emit(eventName, eventData);
}

/**
 * Emit a message to a specified room and event channel.
 * @param {String} room      the name of the room to emit the message to
 * @param {String} eventName the name of the event channel to emit to the room
 * @param {Any}    eventData the data to emit: String, JSON, Object, Array, Integer
 */
function emitToRoom(room, eventName, eventData) {
  // console.log('TODO: THIS FUNCTION IS NOT IMPLEMENTED');
  // console.log(eventData);
  // io.to(room).emit(eventName, eventData);
}

/**
 * Emit the resulting status of an event privately to the socket.
 * @param {Socket.io} socket          the client socket
 * @param {String}    eventResultName the name of the event the response concerns
 * @param {Boolean}   didSucceed      whether or not the request succeeded.
 * @param {Sting}     message         a user-friendly message for debugging purposes or otherwise.
 */
function emitInfoEventResults(socket, eventResultName, didSucceed, message) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocket(socket, 'info', eventData);
}

/**
 * Emit the resulting status of an event requested
 * by the client socketto the 'info' event of the specified room.
 * @param {Socket.io} socket          the client socket
 * @param {String}    eventResultName the name of the event the response concerns
 * @param {Boolean}   didSucceed      whether or not the request succeeded.
 * @param {String}    message         a user-friendly message for debugging purposes or otherwise.
 * @param {String}    room            the name of the room to broadcast the 'info' event to.
 */
function emitInfoFromSocketToRoom(socket, eventResultName, didSucceed, message, room) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocketRoom(socket, room, 'info', eventData);
}

module.exports = {
  emitToSocket,
  emitToRoom,
  emitInfoEventResults,
  emitInfoFromSocketToRoom,
};
