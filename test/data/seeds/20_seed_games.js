exports.seed = knex =>
  Promise.all([
    knex.transaction(trx =>
      knex('game').transacting(trx)
        .insert({
          id: 1,
          name: 'SWEN-356-01 Fall 2017',
          max_round: 5,
          storyteller_id: 1,
        })
        .then(trx.commit)
        .catch(
          (err) => {
            trx.rollback();
            console.error(err);
            process.exit(1);
          }
        )
    ),
  ])
