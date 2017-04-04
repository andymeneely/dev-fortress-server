const bookshelf = require('../lib/bookshelf');

require('./user');
require('./team');

const Game = bookshelf.model('game', {
  tableName: 'game',
  storyteller() {
    return this.hasOne('User');
  },
  team() {
    return this.belongsToMany('Team');
  },
});

module.exports = Game;
