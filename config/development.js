const knexfile = require('../knexfile');

module.exports = {
  // development environment configuration
  database: knexfile.development,
  jwt: {
    algorithm: 'RS256',
    expiresIn: '7d', // expire after 7 days
  },
};
