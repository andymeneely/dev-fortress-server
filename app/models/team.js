const bookshelf = require('../lib/bookshelf');

require('./teamtype');
require('./game');

const Team = bookshelf.model('Team', {
  tableName: 'team',
  teamType() {
    return this.hasOne('TeamType');
  },
  game() {
    return this.hasOne('Game');
  },
});

module.exports = Team;
