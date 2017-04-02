const API_TEAM_LOGIN_URL = require('../../data/constants').API_TEAM_LOGIN_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Team Login API Tests', () => {
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
    it('Team can login with a valid link_code', (done) => {
      const linkCode = '1234567';
      const reqURL = `${API_TEAM_LOGIN_URL}${linkCode}`;
      chai.request(server)
        .get(reqURL)
        .end((err, res) => {
          res.statusCode.should.equal(200);
          should.exist(res.body.token);
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Fail', () => {
    it('Team can login with a valid link_code', (done) => {
      const linkCode = 'nopekek';
      const reqURL = `${API_TEAM_LOGIN_URL}${linkCode}`;
      chai.request(server)
        .get(reqURL)
        .end((err, res) => {
          res.statusCode.should.equal(404);
          should.not.exist(res.body.token);
          should.exist(err);
          done();
        });
    });
  });
});
