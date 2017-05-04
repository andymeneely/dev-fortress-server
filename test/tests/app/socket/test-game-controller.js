const CONSTANTS = require('../../../data/constants');
const gameController = require('../../../../app/socket/controllers/game');
const knex = require('../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');

chai.use(chaiHttp);
const should = chai.should();

describe('Game Socket Functions: ', () => {
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
      emit: (eventName, eventData) => {
        should.exist(eventName);
        should.exist(eventData);
      },
    };
    return mockSocket;
  }

  it('Should pass socket next_round', (done) => {
    const socket = getMockSocket();
    socket.to = () => socket;
    socket.join = (room) => {
      should.exist(room);
    };
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('join room');
      eventData.didSucceed.should.equal(true);
    };
    gameController.nextRound(1, () => {
      // Delay for emitter checks.
      setTimeout(() => {
        done();
      }, CONSTANTS.TIMEOUT);
    });
  });
});
