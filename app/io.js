const Server = require('socket.io');

const ioOptions = {
  path: '/socket',
  serveClient: false,
};

const io = new Server(ioOptions);


io.use((socket, next) => {
  console.log(socket.handshake.query.token);
  next();
});

io.on('connection', (socket) => {
  console.log('Connected!');
  // console.log(util.inspect(socket.request))
  console.log(socket.id);
  socket.emit('current_games', []);
  io.emit('game_start', {id: 1});
  io.emit('game_end', {id: 1});

module.exports = io;
