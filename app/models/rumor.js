const bookshelf = require('../lib/bookshelf');

require('./event');

const Rumor = bookshelf.model('Rumor', {
  tableName: 'rumor',
  event() {
    return this.hasOne('Event');
  },
});

module.exports = Rumor;
