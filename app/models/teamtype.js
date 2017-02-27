const bookshelf = require('../lib/bookshelf');

const TeamType = bookshelf.Model('TeamType', {
  tableName: 'teamtype',
});

module.exports = TeamType;
