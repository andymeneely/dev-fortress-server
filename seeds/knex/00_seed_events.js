const DefaultEvents = require('../data/json/event');

exports.seed = (knex) => {
  const eventPromiseArray = [];
  DefaultEvents.forEach((event) => {
    eventPromiseArray.push(
      knex.transaction((trx) => {
        knex('event').transacting(trx).insert(event)
        .then(trx.commit)
        .catch(
          (err) => {
            trx.rollback();
            console.error(err);
            process.exit(1);
          }
        );
      })
    );
  });

  return Promise.all(eventPromiseArray);
};
