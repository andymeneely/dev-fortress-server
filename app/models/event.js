const bookshelf = require('../lib/bookshelf');

const Event = bookshelf.model('Event', {
  tableName: 'event',
});

module.exports = Event;
