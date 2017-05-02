const bookshelf = require('../lib/bookshelf');

require('./game');
require('./event');

const GameEvent = bookshelf.model('GameEvent', {
  tableName: 'gameevent',
  game() {
    return this.belongsTo('Game');
  },
  event() {
    return this.belongsTo('Event');
  },
});

module.exports = GameEvent;
