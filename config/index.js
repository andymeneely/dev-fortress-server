// const production = require('./production');
const development = require('./development');
const test = require('./test');

function getExports() {
  switch (process.env.NODE_ENV) {
    /* istanbul ignore next */
    case 'production':
      // TODO: Create production configuration file
      return null;
    /* istanbul ignore next */
    case 'development':
      return development;
    case 'test':
      return test;
    /* istanbul ignore next */
    default:
      return null;
  }
}

module.exports = getExports();
