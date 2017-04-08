const DefaultRoles = require('../data/json/role').DefaultRoles;

exports.seed = (knex) => {
  const rolePromiseArray = [];
  DefaultRoles.forEach((role) => {
    rolePromiseArray.push(
      knex.transaction((trx) => {
        knex('role').transacting(trx).insert(role)
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

  return Promise.all(rolePromiseArray);
};
