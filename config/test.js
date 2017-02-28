const knexfile = require('../knexfile');

module.exports = {
  // test environment configuration
  database: knexfile.test,
  jwt: {
    algorithm: 'RS256',
    expiresIn: '7d', // expire after 7 days
  },
};
