const bookshelf = require('../lib/bookshelf');
const has = require('has');

const Action = bookshelf.model('Action', {
  tableName: 'action',
  parse: (attributes) => {
    if (has(attributes, 'repeatable')) {
      if (attributes.repeatable === 1) attributes.repeatable = true;
      else attributes.repeatable = false;
    }
    if (has(attributes, 'requires_mature')) {
      if (attributes.requires_mature === 1) attributes.requires_mature = true;
      else attributes.requires_mature = false;
    }

    return attributes;
  },
});

module.exports = Action;
