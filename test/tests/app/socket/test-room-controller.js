const CONSTANTS = require('../../../data/constants');
const roomController = require('../../../../app/socket/controllers/room');
const knex = require('../../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');

chai.use(chaiHttp);
const should = chai.should();

describe('Room Socket Functions', () => {
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

  it('Should join a Socket to a Room', (done) => {
    const socket = getMockSocket();
    socket.to = () => socket;
    socket.join = (room) => {
      should.exist(room);
    };
    socket.emit = (eventName, eventData) => {
      eventName.should.equal('info');
      eventData.event.should.equal('join_game_room');
      eventData.didSucceed.should.equal(true);
    };
    roomController.joinRoom(socket, 'game_room', () => {
      // Delay for emitter checks.
      setTimeout(() => {
        done();
      }, CONSTANTS.TIMEOUT);
    });
  });
});
