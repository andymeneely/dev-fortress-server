exports.seed = knex =>
  Promise.all([
    knex.transaction(trx =>
        // Insert test_user no admin no professor
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
        )
    ),
    knex.transaction((trx) => {
      // Insert test_user_professor no admin yes professor
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
    }),
    knex.transaction((trx) => {
      // Insert test_user_admin yes admin no professor
      knex('user').transacting(trx).insert({
        username: 'test_user_admin',
        is_admin: true,
      }).then((results) => {
        const userId = results[0];
        return Promise.all([
          knex('email').transacting(trx)
          .insert({
            user_id: userId,
            address: 'test_admin@test.com',
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
    }),
  ]);
