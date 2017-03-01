
exports.seed = knex =>
  knex.transaction((trx) => {
    knex('user').transacting(trx).insert({
      username: 'test_user',
      is_admin: false,
    }).then((results) => {
      const userId = results[0];
      return Promise.all([
        knex('email').transacting(trx)
        .insert({
          user_id: userId,
          address: 'test_user@test.com',
          verified: true,
        }),
        knex('password').transacting(trx)
        .insert({
          user_id: userId,
          password_hash: '$2a$10$cQdFPw67dAF0ICqAJSAey.zHT5whddjk.nva6YwTwXckMW04htDwG',
          valid: true,
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
