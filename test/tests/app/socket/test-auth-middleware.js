const CONSTANTS = require('../../../data/constants');
const knex = require('../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../app');
const authenticationMiddleware = require('../../../../app/socket/middleware/authentication');
const randomString = require('randomstring');

chai.use(chaiHttp);
const should = chai.should();
let teamToken;
let storytellerToken;

describe('Socket AuthenticationMiddleware Tests', () => {
  before((done) => {
    // Authenticate a Team to perform protected queries.
    function authenticateTeam() {
      const reqURL = CONSTANTS.API_TEAM_LOGIN_URL;
      return chai.request(server)
        .post(reqURL)
        .send({
          link: '1234567',
        });
    }
    // Authenticate a User as the Storyteller.
    function authenticateUser() {
      const reqURL = CONSTANTS.API_USER_LOGIN_URL;
      return chai.request(server)
        .post(reqURL)
        .send({
          username: 'test_user_professor',
          password: 'password',
        });
    }

    // Run initial migrations and seed db
    knex.migrate.rollback().then(() =>
      knex.migrate.latest().then(() =>
        knex.seed.run().then(() => {
          const authTeamPromise = authenticateTeam();
          const authUserPromise = authenticateUser();
          Promise.all([authTeamPromise, authUserPromise])
          .then((responses) => {
            const teamRes = responses[0];
            const userRes = responses[1];
            teamToken = teamRes.body.token;
            storytellerToken = userRes.body.token;
            done();
          })
          .catch(e => console.error(e));
        })
      )
    );
  });

  // Internally used for mocking Sockets.
  function getMockSocket() {
    const socketId = randomString.generate(5);
    const mockSocket = {
      id: socketId,
      emit: (eventName, eventData) => {
        should.exist(eventName);
        should.exist(eventData);
      },
    };
    return mockSocket;
  }

  it('Should succeed validateTeamToken', (done) => {
    const socket = getMockSocket();
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('authenticate_team');
      eventData.didSucceed.should.equal(true);
      done();
    };
    authenticationMiddleware.validateTeamToken(socket, teamToken, () => {});
  });

  it('Should fail validateTeamToken', (done) => {
    const invalidTeamToken = 'THIS_IS_FAKE';
    const socket = getMockSocket();
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('authenticate_team');
      eventData.didSucceed.should.equal(false);
      done();
    };
    authenticationMiddleware.validateTeamToken(socket, invalidTeamToken, () => {});
  });

  it('Should succeed validateStorytellerToken', (done) => {
    const socket = getMockSocket();
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('authenticate_storyteller');
      eventData.didSucceed.should.equal(true);
      done();
    };
    authenticationMiddleware.validateUserToken(socket, storytellerToken, () => {});
  });

  it('Should fail validateStorytellerToken', (done) => {
    const socket = getMockSocket();
    const invalidStorytellerToken = 'THIS_IS_FAKE';
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('authenticate_storyteller');
      eventData.didSucceed.should.equal(false);
      done();
    };
    authenticationMiddleware.validateUserToken(socket, invalidStorytellerToken, () => {});
  });
});
