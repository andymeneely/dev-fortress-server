const knex = require('../../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../app');
const API_TEAM_LOGIN_URL = require('../../../../data/constants').API_TEAM_LOGIN_URL;
const authenticationMiddleware = require('../../../../../app/socket/middleware/authentication');
const randomString = require('randomstring');

chai.use(chaiHttp);
const should = chai.should();
let teamToken = null;

describe('Socket AuthenticationMiddleware Tests', () => {
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
      eventData.event.should.equal('authentication');
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
      eventData.event.should.equal('authentication');
      eventData.didSucceed.should.equal(false);
      done();
    };
    authenticationMiddleware.validateTeamToken(socket, invalidTeamToken, () => {});
  });
});
