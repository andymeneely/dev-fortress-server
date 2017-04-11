const bookshelf = require('../lib/bookshelf');

const PreReq = bookshelf.model('PreReq', {
  tableName: 'prereq',
});

module.exports = PreReq;
