exports.seed = knex =>
  knex.transaction((trx) => {
    knex('user').transacting(trx).insert({
      username: 'professor',
      is_admin: false,
    }).then((results) => {
      const userId = results[0];
      return Promise.all([
        knex('email').transacting(trx)
        .insert({
          user_id: userId,
          address: 'professor@test.com',
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
          role_id: 1, // Assumes that role id 1 name is Professor due to seeded roles
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
