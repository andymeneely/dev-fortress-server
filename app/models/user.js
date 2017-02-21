const bookshelf = require('../lib/bookshelf');

require('./email');
require('./password');
require('./role');

const User = bookshelf.model('User', {
  tableName: 'user',
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
