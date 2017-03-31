exports.seed = knex =>
  knex.transaction((trx) => {
    knex('rumor').transacting(trx).insert({
      id: 1,
      name: 'I Smell Smoke',
      description: '*sniff sniff* is something on fire?',
      event_id: 1,
    })
    .then(trx.commit)
    .catch(
      (err) => {
        trx.rollback();
        console.error(err);
        process.exit(1);
      }
    );
  });
