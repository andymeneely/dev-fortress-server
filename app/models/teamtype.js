const bookshelf = require('../lib/bookshelf');

const TeamType = bookshelf.model('TeamType', {
  tableName: 'teamtype',
});

module.exports = TeamType;
