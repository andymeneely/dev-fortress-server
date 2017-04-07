const API_USER_LOGIN_URL = require('../../data/constants').API_USER_LOGIN_URL;
const API_GAME_GET_GAME_BY_ID_URL = require('../../data/constants').API_GAME_GET_GAME_BY_ID_URL;
const API_GAME_GET_GAMES_URL = require('../../data/constants').API_GAME_GET_GAMES_URL;

const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);
let userToken = null;

describe('Game Retrieval API Tests', () => {
  before((done) => {
    // Get and set valid auth token for user requests
    function getUserToken() {
      chai.request(server)
          .post(`${API_USER_LOGIN_URL}`)
          .send({
            username: 'test_user_professor',
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
              .then(() => getUserToken());
          });
      });
  });

  describe('Success', () => {
    it('A Game can be retrieved withRelated teams, storyteller', (done) => {
      const gameId = 1;
      chai.request(server)
          .get(`${API_GAME_GET_GAME_BY_ID_URL}${gameId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .query({ withRelated: ['teams', 'storyteller'] })
          .end((err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(200);
            res.body.id.should.equal(gameId);
            res.body.teams.should.be.an('array');
            res.body.storyteller_id.should.equal(res.body.storyteller.id);
            done();
          });
    });
    it('All Games can be retrieved withRelated teams, storyteller', (done) => {
      chai.request(server)
          .get(`${API_GAME_GET_GAMES_URL}`)
          .set('Authorization', `Bearer ${userToken}`)
          .query({ withRelated: ['teams', 'storyteller'] })
          .end((err, res) => {
            should.not.exist(err);
            res.statusCode.should.equal(200);
            res.body.should.be.an('array');
            // check first game for teams and storyteller
            res.body[0].teams.should.be.an('array');
            res.body[0].storyteller_id.should.equal(res.body[0].storyteller.id);
            done();
          });
    });
  });


  describe('Fail', () => {

  });
});
