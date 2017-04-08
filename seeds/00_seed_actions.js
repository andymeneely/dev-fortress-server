const DefaultActions = require('./data/json/action').DefaultActions;

exports.seed = (knex) => {
  const actionPromiseArray = [];
  DefaultActions.forEach((action) => {
    actionPromiseArray.push(
      knex.transaction((trx) => {
        knex('action').transacting(trx).insert(action)
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

  return actionPromiseArray;
};
