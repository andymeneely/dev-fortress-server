const Server = require('socket.io');
const authMiddleware = require('./socket/middleware/authentication');
const handlers = require('./socket/handlers/handlers');
const redis = require('./redis');

const ioOptions = {
  path: '/socket.io',
  serveClient: false,
};

const io = new Server(ioOptions);

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected.`);
    const socketId = String(socket.id);
    redis.del(socketId);
  });
  socket.on('authenticate_team', (token) => {
    authMiddleware.validateTeamToken(socket, token, (teamId) => {
      handlers.initializeTeam(socket, teamId);
    });
  });
  socket.on('authenticate_storyteller', (token) => {
    authMiddleware.validateUserToken(socket, token, (userId) => {
      handlers.initializeStoryteller(socket, userId);
    });
  });
});

module.exports = io;
