
exports.seed = knex =>
  knex.transaction((trx) => {
    knex('user').transacting(trx).insert({
      username: 'admin',
      is_admin: true,
    }).then((results) => {
      const userId = results[0];
      return Promise.all([
        knex('email').transacting(trx)
        .insert({
          user_id: userId,
          address: 'admin@admin.com',
          verified: false,
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
