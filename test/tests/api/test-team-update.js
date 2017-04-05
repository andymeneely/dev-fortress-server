const API_TEAM_UPDATE_URL = require('../../data/constants').API_TEAM_UPDATE_URL;
const API_TEAM_LOGIN_URL = require('../../data/constants').API_TEAM_LOGIN_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

let teamToken = null;
const teamIdToUpdate = 1;

/**
 * Sends PATCH request with the given requestBody. Passes error/response to callback
 * @param {Object} requestBody - Object containing fields to be updated and their values
 * @param {*} callback - Callback function once request returns
 */
function sendPatchTeamRequest(requestBody, callback) {
  chai.request(server)
    .patch(`${API_TEAM_UPDATE_URL}${teamIdToUpdate}`)
    .set('Authorization', `Bearer ${teamToken}`)
    .send(requestBody)
    .end(callback);
}

describe('Team Update API Tests', () => {
  before((done) => {
    // Authenticate a Team to perform protected queries.
    function authenticateTeam() {
      const reqURL = `${API_TEAM_LOGIN_URL}`;
      chai.request(server)
        .post(reqURL)
        .send({
          link: '1234567',
        })
        .end((err, res) => {
          if (res) {
            teamToken = res.body.token;
            done();
          }
        });
    }

    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => authenticateTeam());
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

  describe('Success', () => {
    it('An existing Team can update their name field', (done) => {
      const requestBody = { name: 'Slow Squadron' };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(200);
        res.body.id.should.equal(teamIdToUpdate);
        res.body.name.should.equal(requestBody.name);
        should.not.exist(err);
        done();
      });
    });
  });

  describe('Fail', () => {
    it('An existing Team cannot update their game_id field', (done) => {
      const requestBody = { game_id: 1 };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });

    it('An existing Team cannot update their teamtype_id field', (done) => {
      const requestBody = { teamtype_id: 1 };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });

    it('An existing Team cannot update their resources field', (done) => {
      const requestBody = { resources: 1 };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });

    it('An existing Team cannot update their mindset field', (done) => {
      const requestBody = { mindset: 1 };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });

    it('An existing Team cannot update their mature field', (done) => {
      const requestBody = { mature: true };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });

    it('An existing Team cannot update their link_code field', (done) => {
      const requestBody = { link_code: 'ASDFGHJ' };
      sendPatchTeamRequest(requestBody, (err, res) => {
        res.statusCode.should.equal(400);
        assert.deepEqual(res.body.request, requestBody);
        should.exist(err);
        done();
      });
    });
  });
});
