const CONSTANTS = require('../../../data/constants');
const teamController = require('../../../../app/socket/controllers/team');
const knex = require('../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');
const redis = require('../../../../app/redis');

chai.use(chaiHttp);
const should = chai.should();

describe('Team Socket Functions', () => {
  before((done) => {
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

  // Internally used for mocking Sockets.
  function getMockSocket() {
    const socketId = randomString.generate(5);
    const mockSocket = {
      id: socketId,
    };
    return mockSocket;
  }

  it('Should add pending Team action to redis', (done) => {
    const socket = getMockSocket();
    const mockTeamModel = {
      id: 2,
      game_id: 1,
    };
    redis.set('team_2', JSON.stringify(mockTeamModel));
    redis.set(socket.id, 2).then(() => {
      teamController.updatePendingTeamAction(socket, 1, 'add', () => {
        setTimeout(() => {
          redis.get('game_1_pending_actions').then((jsonString) => {
            should.exist(jsonString);
            const pendingActions = JSON.parse(jsonString);
            pendingActions['2'][0].should.equal(1);
            done();
          });
        }, CONSTANTS.TIMEOUT);
      });
    });
  });

  it('Should remove pending Team action from redis', (done) => {
    const socket = getMockSocket();
    const mockTeamModel = {
      id: 2,
      game_id: 1,
    };
    redis.set('team_2', JSON.stringify(mockTeamModel));
    redis.set(socket.id, 2).then(() => {
      teamController.updatePendingTeamAction(socket, 1, 'remove', () => {
        setTimeout(() => {
          redis.get('game_1_pending_actions').then((jsonString) => {
            should.exist(jsonString);
            const pendingActions = JSON.parse(jsonString);
            pendingActions['2'].length.should.equal(0);
            done();
          });
        }, CONSTANTS.TIMEOUT);
      });
    });
  });
});
