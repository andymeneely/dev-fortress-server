const API_TEAM_GET_TEAM_BY_ID_URL = require('../../data/constants').API_TEAM_GET_TEAM_BY_ID_URL;
const API_TEAM_GET_TEAMS_URL = require('../../data/constants').API_TEAM_GET_TEAMS_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Team Retrieval API Tests', () => {
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
    it('User can get a Team by ID', (done) => {
      const idToCheck = 1;
      const reqURL = `${API_TEAM_GET_TEAM_BY_ID_URL}${idToCheck}`;
      chai.request(server)
        .get(reqURL)
        .end((err, res) => {
          res.statusCode.should.equal(200);
          res.body.id = idToCheck;
          should.not.exist(err);
          done();
        });
    });
    it('User can get a list of Teams', (done) => {
      chai.request(server)
        .get(`${API_TEAM_GET_TEAMS_URL}`)
        .end((err, res) => {
          res.statusCode.should.equal(200);
          res.body.should.be.an('array');
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Fail', () => {
    it('User cannot get a Team whose ID doesn\'t exist', (done) => {
      const idToCheck = 100;
      const reqURL = `${API_TEAM_GET_TEAM_BY_ID_URL}${idToCheck}`;
      chai.request(server)
        .get(reqURL)
        .end((err, res) => {
          res.statusCode.should.equal(404);
          res.body.error.should.equal('The Team specified by the id in the request does not exist.');
          should.exist(err);
          done();
        });
    });
  });
});
