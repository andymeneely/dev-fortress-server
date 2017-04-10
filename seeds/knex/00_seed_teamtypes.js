const DefaultTeamTypes = require('../data/json/teamtype');

exports.seed = (knex) => {
  const teamtypePromiseArray = [];
  DefaultTeamTypes.forEach((teamtype) => {
    teamtypePromiseArray.push(
      knex.transaction((trx) => {
        knex('teamtype').transacting(trx).insert(teamtype)
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

  return Promise.all(teamtypePromiseArray);
};
