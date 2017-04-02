exports.seed = (knex) => {
  Promise.all([
    knex.transaction((trx) => {
      knex('teamtype').transacting(trx).insert({
        id: 1,
        name: 'iOS',
        description: 'The iOS app development team',
        initial_mature: true,
        initial_resources: 4,
        initial_mindset: 1,
        disabled: false,
      })
      .then(trx.commit)
      .catch(
        (err) => {
          trx.rollback();
          console.error(err);
          process.exit(1);
        }
      );
    }),
    knex.transaction((trx) => {
      knex('teamtype').transacting(trx).insert({
        id: 2,
        name: 'Cloud Computing',
        description: 'The Cloud Computing team',
        initial_mature: false,
        initial_resources: 5,
        initial_mindset: 0,
        disabled: false,
      })
      .then(trx.commit)
      .catch(
        (err) => {
          trx.rollback();
          console.error(err);
          process.exit(1);
        }
      );
    }),
  ]);
};

