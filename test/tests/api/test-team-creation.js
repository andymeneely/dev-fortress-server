const API_TEAM_CREATE_URL = require('../../data/constants').API_TEAM_CREATE_URL;
const API_USER_LOGIN_URL = require('../../data/constants').API_USER_LOGIN_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();
const assert = chai.assert;

let profAuthToken = '';
let userAuthToken = '';

chai.use(chaiHttp);

describe('Team Creation API Tests', () => {
  // Get the token for the Professor account
  before((done) => {
    /**
     * Internal helper function
     * Returns a Promise for logging into the seeded Professor account.
     */
    function loginAsProf() {
      return chai.request(server)
        .post(`${API_USER_LOGIN_URL}`)
        .send({
          username: 'test_user_professor',
          password: 'password',
        });
    }

    /**
     * Internal helper function
     * Returns a Promise for logging into the seeded User account.
     */
    function loginAsUser() {
      return chai.request(server)
        .post(`${API_USER_LOGIN_URL}`)
        .send({
          username: 'test_user',
          password: 'password',
        });
    }

    /**
     * Internal helper function
     * Dispatches login requests and sets the token data for the applicable User.
     */
    function setAuthTokens() {
      const profLoginPromise = loginAsProf();
      const userLoginPromise = loginAsUser();

      Promise.all([profLoginPromise, userLoginPromise]).then((responses) => {
        profAuthToken = responses[0].body.token;
        userAuthToken = responses[1].body.token;
        done();
      }, console.error);
    }

    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => setAuthTokens());
          });
      });
  });

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

  /**
   * Internal helper function.
   * Returns a valid object containing key/value pairs for request bodies.
   */
  function getMockTeamCreateRequestBody() {
    return {
      name: 'The Best Security Team',
      mature: false,
      resources: 10,
      mindset: 5,
      teamtype_id: 1,
      game_id: 1,
    };
  }

  describe('Success', () => {
    it('Professor can create a Team with all parameters', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${profAuthToken}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(201);
          const resBody = res.body;
          resBody.name.should.equal(reqBody.name);
          resBody.mature.should.equal(reqBody.mature);
          resBody.resources.should.equal(reqBody.resources);
          resBody.mindset.should.equal(reqBody.mindset);
          resBody.teamtype_id.should.equal(reqBody.teamtype_id);
          resBody.game_id.should.equal(reqBody.game_id);
          should.exist(resBody.link_code);
          resBody.link_code.should.be.a('string');
          done();
        });
    });
    it('Professor can create a Team using only required parameters', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      delete reqBody.name;
      delete reqBody.mature;
      delete reqBody.mindset;
      delete reqBody.resources;
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${profAuthToken}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(201);

          const resBody = res.body;
          resBody.should.include.keys('name', 'mature', 'resources', 'mindset', 'teamtype_id', 'game_id');
          resBody.teamtype_id.should.equal(reqBody.teamtype_id);
          resBody.game_id.should.equal(reqBody.game_id);
          should.exist(resBody.link_code);
          resBody.link_code.should.be.a('string');
          done();
        });
    });
  });

  describe('Fail', () => {
    it('Unauthenticated User may not create a Team', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(401);
          const resBody = res.body;
          resBody.error.should.equal('Unauthorized');
          resBody.message.should.equal('You are not authenticated.');
          done();
        });
    });
    it('A non-admin User who is not in the Professor role may not create a Team', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(403);
          const resBody = res.body;
          resBody.error.should.equal('Forbidden');
          resBody.message.should.equal('User must be part of the \'professor\' Role to perform this action');
          done();
        });
    });
    it('A Professor may not create a Team with an invalid "teamtype_id" field', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      reqBody.teamtype_id = 100;
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${profAuthToken}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(400);
          const resBody = res.body;
          resBody.error.should.equal('A TeamType whose id matches "team_id" in the request body does not exist.');
          assert.deepEqual(resBody.request, reqBody);
          done();
        });
    });
    it('A Professor may not create a Team with an invalid "game_id" field', (done) => {
      const reqBody = getMockTeamCreateRequestBody();
      reqBody.game_id = 100;
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${profAuthToken}`)
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(400);
          const resBody = res.body;
          resBody.error.should.equal('A Game whose id matches "game_id" in the request body does not exist.');
          assert.deepEqual(resBody.request, reqBody);
          done();
        });
    });
  });
});
