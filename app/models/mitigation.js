const bookshelf = require('../lib/bookshelf');

require('./event');

const Mitigation = bookshelf.model('Mitigation', {
  tableName: 'mitigation',
  event() {
    return this.belongsTo('Event');
  },
});

module.exports = Mitigation;
