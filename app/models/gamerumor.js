const bookshelf = require('../lib/bookshelf');

require('./game');
require('./rumor');

const GameEvent = bookshelf.model('GameRumor', {
  tableName: 'gamerumor',
  game() {
    return this.belongsTo('Game');
  },
  rumor() {
    return this.belongsTo('Rumor');
  },
});

module.exports = GameEvent;
