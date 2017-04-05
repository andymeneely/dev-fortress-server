exports.seed = (knex) => {
  Promise.all([
    knex.transaction((trx) => {
      knex('team').transacting(trx).insert({
        name: 'Elite Haxors',
        mature: false,
        resources: 5,
        mindset: 10,
        teamtype_id: 1,
        game_id: 1,
        link_code: '1234567',
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
      knex('team').transacting(trx).insert({
        name: 'The Happy Team',
        mature: true,
        resources: 2,
        mindset: 15,
        teamtype_id: 2,
        game_id: 1,
        link_code: 'qwertyu',
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

