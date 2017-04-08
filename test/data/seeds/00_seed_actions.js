exports.seed = knex =>
  Promise.all([
    knex.transaction((trx) => {
      knex('action').transacting(trx).insert({
        name: 'Deploy SSL/TLS',
        description: 'Deploy the widely-adopted cryptographic protocol to prevent unauthorized packet sniffing.',
        devcaps_cost: 1,
        mindset_reward: 0,
        repeatable: false,
        requires_mature: false,
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
      knex('action').transacting(trx).insert({
        name: 'Conduct Code Reviews on New Changes',
        description: 'Have developers invite each other to code reviews of their commits to determine design, style, security, and other potential issues they see without executing the code.',
        devcaps_cost: 2,
        mindset_reward: 1,
        repeatable: true,
        requires_mature: false,
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
      knex('action').transacting(trx).insert({
        name: 'Simulate Massive Traffic Events',
        description: 'Automate how your users interact with the system (e.g. clicks, or network traffic) and repeat it many times to stress your system. Great for finding availability issues.',
        devcaps_cost: 3,
        mindset_reward: 0,
        repeatable: true,
        requires_mature: true,
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
