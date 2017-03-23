const bookshelf = require('../lib/bookshelf');

require('./user');

const Game = bookshelf.model('game', {
  tableName: 'game',
  storyteller() {
    return this.hasOne('User');
  },
});

module.exports = Game;
