const bookshelf = require('../lib/bookshelf');

require('./user');
require('./team');

const Game = bookshelf.model('game', {
  tableName: 'game',
  storyteller() {
    return this.hasOne('user');
  },
  team() {
    return this.hasMany('team');
  },
});

module.exports = Game;
