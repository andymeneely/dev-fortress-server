const bookshelf = require('../lib/bookshelf');

require('./teamtype');
require('./game');

const Team = bookshelf.model('Team', {
  tableName: 'team',
  teamtype() {
    return this.belongsTo('TeamType');
  },
  game() {
    return this.belongsTo('Game');
  },
});

module.exports = Team;
