const DefaultPreReqs = require('../data/json/prereq');

exports.seed = (knex) => {
  const prereqPromiseArray = [];
  DefaultPreReqs.forEach((prereq) => {
    prereqPromiseArray.push(
      knex.transaction((trx) => {
        knex('prereq').transacting(trx).insert(prereq)
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

  return Promise.all(prereqPromiseArray);
};

