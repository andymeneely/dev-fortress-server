const API_ACTION_GET_ACTIONS_URL = require('../../data/constants').API_ACTION_GET_ACTIONS_URL;
const API_ACTION_GET_ACTION_BY_ID_URL = require('../../data/constants').API_ACTION_GET_ACTION_BY_ID_URL;
const API_USER_LOGIN_URL = require('../../data/constants').API_USER_LOGIN_URL;

const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

describe('Action Retrieval API Tests', () => {

  let userToken;

  before((done) => {
    function loginAsUser() {
      chai.request(server)
          .post(`${API_USER_LOGIN_URL}`)
          .send({
            username: 'test_user',
            password: 'password',
          })
          .end((err, res) => {
            userToken = res.body.token;
            done();
          });
    }
    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => loginAsUser());
          });
      });
  });

  describe('Success', () => {
    it('A User can retrieve all Actions', (done) => {
      chai.request(server)
          .get(`${API_ACTION_GET_ACTIONS_URL}`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(200);
            res.body.should.be.an('array');
            done();
          });
    });

    it('A User can retrieve an existing Action by ID', (done) => {
      const actionId = 1;
      chai.request(server)
          .get(`${API_ACTION_GET_ACTION_BY_ID_URL}${actionId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(200);
            res.body.id.should.equal(actionId);
            res.body.prereqs.should.be.an('array');
            done();
          });
    });
  });

  describe('Fail', () => {
    it('A User cannot retrieve an Action whose ID doesn\'t exist', (done) => {
      const actionId = 100;
      chai.request(server)
          .get(`${API_ACTION_GET_ACTION_BY_ID_URL}${actionId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            should.exist(err);
            res.statusCode.should.equal(404);
            res.body.error.should.equal('The requested Action could not be found');
            res.body.request.params.id.should.equal(actionId.toString());
            done();
          });
    });
  });
});

chai.use(chaiHttp);

