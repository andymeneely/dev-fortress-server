const Server = require('socket.io');

const ioOptions = {
  path: '/socket',
  serveClient: false,
};

const io = new Server(ioOptions);

io.on('connetion', (socket) => {
  console.log(socket);
})

module.exports = io;
