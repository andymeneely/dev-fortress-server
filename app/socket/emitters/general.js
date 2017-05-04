/**
 * @module /socket/emitters/general
 */
// const io = require('../../io');

function emitToSocket(socket, eventName, eventData) {
  socket.emit(eventName, eventData);
}

function emitToSocketRoom(socket, room, eventName, eventData) {
  socket.to(room).emit(eventName, eventData);
}

function emitToRoom(room, eventName, eventData) {
  // console.log('TODO: THIS FUNCTION IS NOT IMPLEMENTED');
  // console.log(eventData);
  // io.to(room).emit(eventName, eventData);
}

function emitInfoEventResults(socket, eventResultName, didSucceed, message) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocket(socket, 'info', eventData);
}

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
