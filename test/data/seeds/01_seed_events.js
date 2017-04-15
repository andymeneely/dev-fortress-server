exports.seed = knex =>
  Promise.all([
    knex.transaction((trx) => {
      knex('event').transacting(trx).insert({
        id: 1,
        name: 'Test',
        description: 'This is a test',
        default_damage: 100,
        disabled: 0,
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
      knex('event').transacting(trx).insert({
        id: 2,
        name: 'Aliens Attack',
        description: 'Aliens attack your server room. All applications are affected.',
        default_damage: 50,
        disabled: 0,
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
