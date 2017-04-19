exports.seed = knex =>
  Promise.all([
    knex.transaction((trx) => {
      knex('mitigation').transacting(trx).insert({
        id: 1,
        type: 'ANY_ANY',
        data: JSON.stringify({
          teamtypes: [1, 2],
          actions: [12, 15],
          reward_value: 5,
        }),
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
    }),
    knex.transaction((trx) => {
      knex('mitigation').transacting(trx).insert({
        id: 2,
        type: 'ANY_ANY',
        data: JSON.stringify({
          teamtypes: [3, 4],
          actions: [2, 1],
          reward_value: 10,
        }),
        event_id: 2,
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
