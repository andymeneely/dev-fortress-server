const bookshelf = require('../lib/bookshelf');

require('./user');
require('./team');

const Game = bookshelf.model('Game', {
  tableName: 'game',
  hasTimestamps: ['created_at'],
  parse: (attributes) => {
    if (attributes.created_at) {
      const createdDate = new Date(attributes.created_at);
      attributes.created_at = createdDate.toISOString();
    }
    return attributes;
  },
  storyteller() {
    return this.hasOne('User');
  },
  team() {
    return this.belongsToMany('Team');
  },
});

module.exports = Game;
