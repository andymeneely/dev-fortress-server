const bookshelf = require('../lib/bookshelf');

require('./rumor');

const Event = bookshelf.model('Event', {
  tableName: 'event',
  rumors() {
    return this.belongsToMany('Rumor');
  },
});

module.exports = Event;
