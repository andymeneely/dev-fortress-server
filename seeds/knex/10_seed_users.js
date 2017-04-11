const DefaultUsers = require('../data/json/user');

exports.seed = (knex) => {
  const userPromiseArray = [];
  DefaultUsers.forEach((user) => {
    userPromiseArray.push(
      knex.transaction((trx) => {
        knex('user').transacting(trx).insert(user.user)
        .returning('id')
        .then((results) => {
          const userId = results[0];
          user.email.user_id = userId;
          user.password.user_id = userId;
          const rolePromiseArray = [
            knex('email').transacting(trx).insert(user.email),
            knex('password').transacting(trx).insert(user.password),
          ];
          if (user.user_role.length > 0) {
            user.user_role.forEach((userRole) => {
              userRole.user_id = userId;
              rolePromiseArray.push(
                knex('user_role').transacting(trx).insert(userRole)
              );
            });
          }
          return Promise.all(rolePromiseArray);
        })
        .then(trx.commit)
        .catch(
          (err) => {
            trx.rollback();
            console.error(err);
            process.exit(1);
          }
        );
      })
    );
  });

  return Promise.all(userPromiseArray);
};
