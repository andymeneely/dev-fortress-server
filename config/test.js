const knexfile = require('../knexfile');

module.exports = {
  // test environment configuration
  database: knexfile.test,
  jwt: {
    algorithm: 'RS256',
    expiresIn: '1800000', // expire after 1 minute
  },
};
