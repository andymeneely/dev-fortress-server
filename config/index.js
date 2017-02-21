// const production = require('./production');
const development = require('./development');
const test = require('./test');

function getExports() {
  switch (process.env.NODE_ENV) {
    case 'production':
      // TODO: Create production configuration file
      return null;
    case 'development':
      return development;
    case 'test':
      return test;
    default:
      return null;
  }
}

module.exports = getExports();
