const bookshelf = require('../lib/bookshelf');

const Action = bookshelf.model('Action', {
  tableName: 'action',
});

module.exports = Action;
