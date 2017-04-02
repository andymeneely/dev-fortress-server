const bookshelf = require('../lib/bookshelf');

require('./teamtype');
require('./game');

const Team = bookshelf.model('Team', {
  tableName: 'team',
  teamType() {
    return this.hasOne('teamtype');
  },
  game() {
    return this.belongsTo('game');
  },
});

module.exports = Team;
