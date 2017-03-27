exports.seed = knex =>
  knex.transaction((trx) => {
    knex('teamtype').transacting(trx).insert({
      id: 1,
      name: 'System Security Team',
      description: 'In charge of all internal service security measures.',
      initial_mature: false,
      initial_resources: 20,
      initial_mindset: 1,
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
