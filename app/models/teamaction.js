const bookshelf = require('../lib/bookshelf');
require('./team');
require('./action');

const TeamAction = bookshelf.model('TeamAction', {
  tableName: 'teamaction',
  team() {
    return this.belongsTo('Team');
  },
  action() {
    return this.belongsTo('Action');
  },
});

module.exports = TeamAction;
