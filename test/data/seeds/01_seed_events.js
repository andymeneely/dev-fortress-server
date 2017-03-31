exports.seed = knex =>
  knex.transaction((trx) => {
    knex('event').transacting(trx).insert({
      id: 1,
      name: 'Test',
      description: 'This is a test',
      default_damage: 100,
      disabled: 1,
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
