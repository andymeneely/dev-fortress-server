const knex = require('../../../app/lib/db');
const chai = require('chai');
const UserController = require('../../../app/controllers/user');
const MockExpressResponse = require('mock-express-response');

const should = chai.should();

// Timeout to be used for checking controller responses
const timeout = 250;

function getMockRegisterUserReq() {
  return {
    body: {
      username: 'test_user_model',
      password: 'password',
      email: 'test_user_model@test.com',
      name: 'Test User Model',
      is_admin: false,
    },
  };
}

describe('User Controller Tests', () => {
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
  describe('user controller registerNewUser', () => {
    describe('user controller registerNewUser success', () => {
      it('should succeed registerNewUser', (done) => {
        const mockReq = getMockRegisterUserReq();
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          mockRes.statusMessage.should.equal('OK');
          done();
        }, timeout);
      });
    });
    describe('user controller registerNewUser fail', () => {
      it('should fail registerNewUser missing username', (done) => {
        const mockReq = getMockRegisterUserReq();
        delete mockReq.body.username;
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
      it('should fail registerNewUser missing password', (done) => {
        const mockReq = getMockRegisterUserReq();
        delete mockReq.body.password;
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
      it('should pass registerNewUser missing is_admin', (done) => {
        const mockReq = getMockRegisterUserReq();
        delete mockReq.body.is_admin;
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          mockRes.statusMessage.should.equal('OK');
          done();
        }, timeout);
      });
      it('should pass registerNewUser missing name', (done) => {
        const mockReq = getMockRegisterUserReq();
        delete mockReq.body.name;
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(200);
          mockRes.statusMessage.should.equal('OK');
          done();
        }, timeout);
      });
      it('should fail registerNewUser missing email', (done) => {
        const mockReq = getMockRegisterUserReq();
        delete mockReq.body.email;
        const mockRes = new MockExpressResponse();
        UserController.registerNewUser(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(400);
          mockRes.statusMessage.should.equal('Bad Request');
          done();
        }, timeout);
      });
    });
  });
  describe('user controller getUsers', () => {
    it('user controller getUsers success', (done) => {
      const mockReq = {};
      const mockRes = new MockExpressResponse();
      UserController.getUsers(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(200);
        mockRes.statusMessage.should.equal('OK');
        mockRes._getJSON().should.be.an('array');
        done();
      }, timeout);
    });
  });
});
