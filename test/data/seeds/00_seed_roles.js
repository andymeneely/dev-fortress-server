exports.seed = knex =>
  knex.transaction((trx) => {
    knex('role').transacting(trx).insert({
      id: 1,
      name: 'professor',
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
