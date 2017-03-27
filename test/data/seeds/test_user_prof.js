exports.seed = knex =>
  knex.transaction((trx) => {
    knex('user').transacting(trx).insert({
      username: 'test_user_professor',
      is_admin: false,
    }).then((results) => {
      const userId = results[0];
      return Promise.all([
        knex('email').transacting(trx)
        .insert({
          user_id: userId,
          address: 'test_user_professor@test.com',
          verified: true,
        }),
        knex('password').transacting(trx)
        .insert({
          user_id: userId,
          password_hash: '$2a$10$cQdFPw67dAF0ICqAJSAey.zHT5whddjk.nva6YwTwXckMW04htDwG',
          valid: true,
        }),
        knex('user_role').transacting(trx)
        .insert({
          user_id: userId,
          role_id: 1,
        }),
        knex('game').transacting(trx)
        .insert({
          id: 1,
          name: 'SWEN-356-01 Fall 2017',
          max_round: 5,
          storyteller_id: 1,
        }),
      ]);
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
