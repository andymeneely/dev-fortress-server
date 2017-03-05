const bookshelf = require('../lib/bookshelf');

const Rumor = bookshelf.model('Rumor', {
  tableName: 'rumor',
});

module.exports = Rumor;
