const bookshelf = require('../lib/bookshelf');

require('./event');

const Mitigation = bookshelf.model('Mitigation', {
  tableName: 'mitigation',
  parse: (attributes) => {
    if (attributes.data) {
      if (typeof attributes.data === 'string') {
        const mitigationData = attributes.data;
        attributes.data = JSON.parse(mitigationData);
      }
    }
    return attributes;
  },
  event() {
    return this.belongsTo('Event');
  },
});

module.exports = Mitigation;
