const knex = require('../../../../app/lib/db');
const chai = require('chai');
const EventController = require('../../../../app/controllers/event');
const MockExpressResponse = require('mock-express-response');
const timeout = require('../../../data/constants').TIMEOUT;

const should = chai.should();
const assert = chai.assert;

function getMockCreateEventReq() {
  return {
    body: {
      name: 'Hey! Im testin here!',
      description: 'New event for testing!',
      default_damage: 100,
      disabled: false,
    },
  };
}

describe('Event Controller Tests', () => {
  describe('event controller createEvent', () => {
    before((done) => {
      knex.migrate.rollback()
        .then(() => {
          knex.migrate.latest()
            .then(() => {
              knex.seed.run()
                .then(() => {
                  done();
                });
            });
        });
    });
    after((done) => {
      knex.migrate.rollback()
        .then(() => {
          knex.migrate.latest()
            .then(() => {
              knex.seed.run()
                .then(() => {
                  done();
                });
            });
        });
    });

    describe('event controller createEvent success', () => {
      it('should succeed createEvent', (done) => {
        const mockReq = getMockCreateEventReq();
        const mockRes = new MockExpressResponse();
        EventController.createEvent(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          mockRes.statusMessage.should.equal('OK');
          done();
        }, timeout);
      });
    });

    describe('event controller createEvent fail', () => {
      it('should fail createEvent missing name', (done) => {
        const mockReq = getMockCreateEventReq();
        delete mockReq.body.name;
        const mockRes = new MockExpressResponse();
        EventController.createEvent(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
      it('should fail createEvent missing description', (done) => {
        const mockReq = getMockCreateEventReq();
        delete mockReq.body.description;
        const mockRes = new MockExpressResponse();
        EventController.createEvent(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
      it('should fail createEvent missing default_damage', (done) => {
        const mockReq = getMockCreateEventReq();
        delete mockReq.body.default_damage;
        const mockRes = new MockExpressResponse();
        EventController.createEvent(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
    });
  });

  describe('event controller getEvents', () => {
    describe('event Controller getEvents success', () => {
      it('should succeed getEvents', (done) => {
        const mockReq = {
          body: { },
        };
        const mockRes = new MockExpressResponse();
        EventController.getEvents(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          const resJSON = mockRes._getJSON();
          resJSON.should.be.an('array');
          done();
        }, timeout);
      });
    });
  });

  describe('event controller getEventById', () => {
    describe('event Controller getEventById success', () => {
      it('should succeed getEventById', (done) => {
        const mockReq = {
          params: { id: 1 },
        };
        const mockRes = new MockExpressResponse();
        EventController.getEventById(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          const resJSON = mockRes._getJSON();
          resJSON.id.should.equal(1);
          done();
        }, timeout);
      });
    });
    describe('event Controller getEventById fail', () => {
      it('should fail getEventById', (done) => {
        const mockReq = {
          params: { id: 100 },
        };
        const mockRes = new MockExpressResponse();
        EventController.getEventById(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(404);
          const resJSON = mockRes._getJSON();
          resJSON.error.should.equal('An Event with that ID could not be found.');
          assert.deepEqual(resJSON.request, mockReq);
          done();
        }, timeout);
      });
    });
  });
});
