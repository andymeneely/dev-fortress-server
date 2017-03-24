const knex = require('../../../../app/lib/db');
const chai = require('chai');
const RumorController = require('../../../../app/controllers/rumor');
const MockExpressResponse = require('mock-express-response');
const timeout = require('../../../data/constants').TIMEOUT;

const should = chai.should();
const assert = chai.assert;

function getMockCreateRumorReq() {
  return {
    body: {
      name: 'Death March',
      description: 'Failure is imminent...',
      event_id: 1,
    },
  };
}

describe('Rumor Controller Tests', () => {
  describe('rumor controller createRumor', () => {
    beforeEach((done) => {
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
    afterEach((done) => {
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

    describe('rumor controller createRumor success', () => {
      it('should succeed createRumor', (done) => {
        const mockReq = getMockCreateRumorReq();
        const mockRes = new MockExpressResponse();
        RumorController.createRumor(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          mockRes.statusMessage.should.equal('OK');
          done();
        }, timeout);
      });
    });

    describe('rumor controller createRumor fail', () => {
      it('should fail createRumor missing name', (done) => {
        const mockReq = getMockCreateRumorReq();
        delete mockReq.body.name;
        const mockRes = new MockExpressResponse();
        RumorController.createRumor(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          const resJSON = mockRes._getJSON();
          resJSON.error.should.equal('"name" is a required field.');
          done();
        }, timeout);
      });
      it('should fail createRumor missing description', (done) => {
        const mockReq = getMockCreateRumorReq();
        delete mockReq.body.description;
        const mockRes = new MockExpressResponse();
        RumorController.createRumor(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          const resJSON = mockRes._getJSON();
          resJSON.error.should.equal('"description" is a required field.');
          done();
        }, timeout);
      });
      it('should fail createRumor missing event_id', (done) => {
        const mockReq = getMockCreateRumorReq();
        delete mockReq.body.event_id;
        const mockRes = new MockExpressResponse();
        RumorController.createRumor(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          const resJSON = mockRes._getJSON();
          resJSON.error.should.equal('"event_id" is a required field.');
          done();
        }, timeout);
      });
    });
  });

  describe('rumor controller getRumors', () => {
    describe('rumor Controller getRumors success', () => {
      it('should succeed getRumors', (done) => {
        const mockReq = {
          body: { },
        };
        const mockRes = new MockExpressResponse();
        RumorController.getRumors(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          const resJSON = mockRes._getJSON();
          resJSON.should.be.an('array');
          done();
        }, timeout);
      });
    });
  });

  describe('rumor controller getRumorById', () => {
    describe('rumor Controller getRumorById success', () => {
      it('should succeed getRumorById', (done) => {
        const mockReq = {
          params: { id: 1 },
        };
        const mockRes = new MockExpressResponse();
        RumorController.getRumorById(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          const resJSON = mockRes._getJSON();
          resJSON.id.should.equal(1);
          done();
        }, timeout);
      });
    });
    describe('rumor Controller getRumorById fail', () => {
      it('should fail getRumorById', (done) => {
        const mockReq = {
          params: { id: 100 },
        };
        const mockRes = new MockExpressResponse();
        RumorController.getRumorById(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(404);
          const resJSON = mockRes._getJSON();
          resJSON.error.should.equal('A Rumor with that ID does not exist.');
          assert.deepEqual(resJSON.request, mockReq);
          done();
        }, timeout);
      });
    });
  });
});
