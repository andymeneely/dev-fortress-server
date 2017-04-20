const knex = require('../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../app');
const io = require('socket.io-client');
const SOCKET_URL = require('../../../data/constants').SOCKET_URL;
const API_TEAM_LOGIN_URL = require('../../../data/constants').API_TEAM_LOGIN_URL;

chai.use(chaiHttp);
const should = chai.should;
const socketOptions = {
  transports: ['websocket'],
  'force new connection': true,
};

let teamToken = null;

describe('Team Socket', () => {
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

  it('Should allow Team to connect', (done) => {
    const teamSocket = io('http://localhost:3000/');
    teamSocket.on('connect', () => {
      teamSocket.close();
      done();
    });
    teamSocket.on('error', (err) => {
      console.error(err);
      should.not.exist(err);
    });
  });

  it('Should allow Team to authenticate', (done) => {
    const teamSocket = io('http://localhost:3000/');
    teamSocket.on('connect', () => {
      teamSocket.on('info', (info) => {
        info.should.have.property('event');
        if (info.event === 'authenticate_team') {
          info.should.have.property('didSucceed');
          info.should.have.property('message');
          info.didSucceed.should.equal(true);
          done();
        }
      });
      teamSocket.emit('authenticate_team', teamToken);
    });
    teamSocket.on('error', (err) => {
      console.error(err);
    });
  });
});

