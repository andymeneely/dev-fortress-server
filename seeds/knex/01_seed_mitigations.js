const DefaultMitigations = require('../data/json/mitigation');

exports.seed = (knex) => {
  const mitigationPromiseArray = [];
  DefaultMitigations.forEach((mitigation) => {
    mitigation.data = JSON.stringify(mitigation.data);
    mitigationPromiseArray.push(
      knex.transaction((trx) => {
        knex('mitigation').transacting(trx).insert(mitigation)
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

  return Promise.all(mitigationPromiseArray);
};
