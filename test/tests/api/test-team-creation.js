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

  const mockTeamCreateRequestBody = {
    name: 'The Best Security Team',
    mature: false,
    resources: 10,
    mindset: 5,
    type_id: 1,
    game_id: 1,
  };

  describe('Success', () => {
    it('Professor can create a Team with all parameters', (done) => {
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .set('Authorization', `Bearer ${profAuthToken}`)
        .send(mockTeamCreateRequestBody)
        .end((err, res) => {
          res.should.have.status(201);
          const resBody = res.body;
          resBody.name.should.equal(mockTeamCreateRequestBody.name);
          resBody.mature.should.equal(mockTeamCreateRequestBody.mature);
          resBody.resources.should.equal(mockTeamCreateRequestBody.resources);
          resBody.mindset.should.equal(mockTeamCreateRequestBody.mindset);
          resBody.type_id.should.equal(mockTeamCreateRequestBody.type_id);
          resBody.game_id.should.equal(mockTeamCreateRequestBody.game_id);
          done();
        });
    });
    it('Professor can create a Team using only required parameters');
  });

  describe('Fail', () => {
    it('Unauthenticated User may not create a Team', (done) => {
      chai.request(server)
        .post(`${API_TEAM_CREATE_URL}`)
        .send(mockTeamCreateRequestBody)
        .end((err, res) => {
          res.should.have.status(401);
          const resBody = res.body;
          resBody.error.should.equal('Unauthorized');
          resBody.message.should.equal('You are not authenticated.');
          done();
        });
    });
    it('A non-admin User who is not in the Professor role may not create a Team');
  });
});
