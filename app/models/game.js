const bookshelf = require('../lib/bookshelf');

require('./user');
require('./team');

const Game = bookshelf.model('game', {
  tableName: 'game',
  storyteller() {
    return this.hasOne('User');
  },
  teams() {
    return this.hasMany('Team');
  },
});

module.exports = Game;
