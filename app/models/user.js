const bookshelf = require('../lib/bookshelf');

require('./email');
require('./password');
require('./role');

const User = bookshelf.model('User', {
  tableName: 'user',
  hasTimestamps: ['created_at'],
  parse: (attributes) => {
    if (attributes.created_at) {
      const createdDate = new Date(attributes.created_at);
      attributes.created_at = createdDate.toISOString();
    }
    return attributes;
  },
  password() {
    return this.hasOne('Password');
  },
  email() {
    return this.hasOne('Email');
  },
  roles() {
    return this.belongsToMany('Role', 'user_role');
  },
});

module.exports = User;
