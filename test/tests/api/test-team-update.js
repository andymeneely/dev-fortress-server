const API_TEAM_UPDATE_URL = require('../../data/constants').API_TEAM_UPDATE_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Team Update API Tests', () => {
  beforeEach((done) => {
    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => done());
          });
      });
  });

  describe('Success', () => {
    it('An existing Team can update their name field', (done) => {
      const newName = 'Slow Squadron';
      const idToUpdate = 1;
      const reqURL = `${API_TEAM_UPDATE_URL}${idToUpdate}`;
      chai.request(server)
        .patch(reqURL)
        .send({ name: newName })
        .end((err, res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(idToUpdate);
          res.body.name.should.equal(newName);
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Fail', () => {

  });
});
