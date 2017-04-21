const chai = require('chai');
const knex = require('../../../../app/lib/db');
const TeamAction = require('../../../../app/models/teamaction');

const should = chai.should();
const assert = chai.assert;

describe('TeamAction Models Tests', () => {
  before((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });
  after((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });
  it('Test Create TeamAction', (done) => {
    const teamActionData = {
      team_id: 1,
      action_id: 1,
      round: 1,
    };
    TeamAction.forge(teamActionData).save().then((id) => {
      should.exist(id);
      done();
    }).catch((err) => {
      should.not.exist(err);
    });
  });
  it('Test Get All TeamAction', (done) => {
    TeamAction.fetchAll().then((collection) => {
      should.exist(collection);
      done();
    }).catch((err) => {
      should.not.exist(err);
    });
  });
});
