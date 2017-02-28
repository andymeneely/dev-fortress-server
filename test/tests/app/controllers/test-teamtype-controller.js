const knex = require('../../../../app/lib/db');
const chai = require('chai');
const TeamTypeController = require('../../../../app/controllers/teamtype');
const MockExpressResponse = require('mock-express-response');

const should = chai.should();

// Timeout to be used for checking controller responses
const timeout = 250;

function getMockCreateTeamTypeReq() {
  return {
    body: {
      name: 'Android',
      description: 'the android app team',
      initial_mature: true,
      initial_resources: 5,
      initial_mindset: 1,
      disabled: false,
    },
  };
}

describe('TeamType Controller Tests', () => {
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
      done();
    });
  });
  describe('teamtype controller createTeamType', () => {
    describe('teamtype controller createTeamType success', () => {
      it('should succeed createTeamType', (done) => {
        const mockReq = getMockCreateTeamTypeReq();
        const mockRes = new MockExpressResponse();
        TeamTypeController.createTeamType(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          // Ensure that the created TeamType matches request body
          mockRes._getJSON().should.contain(mockReq.body);
          // Check that exact entity exists in database.
          knex('teamtype').where(mockReq.body)
            .then((results) => {
              results.should.be.an('array');
              results.should.have.lengthOf(1);
              done();
            });
        }, timeout);
      });
    });
    describe('teamtype controller createTeamType fail', () => {
      it('should fail createTeamType name exists');
      it('should fail createTeamType missing name');
      it('should fail createTeamType missing description');
      it('should fail createTeamType missing initial_mature');
      it('should fail createTeamType missing initial_mindset');
      it('should fail createTeamType missing initial_resources');
    });
  });
  describe('teamtype controller getTeamTypes', () => {
    describe('teamtype Controller getTeamTypes success', () => {
      it('should succeed getTeamTypes');
    });
    describe('teamtype Controller getTeamTypes fail', () => {
      it('should fail getTeamTypes');
    });
  });
  describe('teamtype controller getTeamTypeById', () => {
    describe('teamtype Controller getTeamTypeById success', () => {
      it('should succeed getTeamTypeById');
    });
    describe('teamtype Controller getTeamTypeById fail', () => {
      it('should fail getTeamTypeById');
    });
  });
});
