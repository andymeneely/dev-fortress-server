const knex = require('../../../../app/lib/db');
const chai = require('chai');
const UserController = require('../../../../app/controllers/user');
const MockExpressResponse = require('mock-express-response');
const API_USER_GET_USER_BY_ID = require('../../../data/constants').API_USER_GET_USER_BY_ID;
const API_USER_LOGIN_URL = require('../../../data/constants').API_USER_LOGIN_URL;
const server = require('../../../../app');
const timeout = require('../../../data/constants').TIMEOUT;

const should = chai.should();
let adminAuthToken = '';
let userAuthToken = '';

function getMockRegisterUserReq() {
  return {
    body: {
      username: 'test_user_model',
      password: 'password',
      email: 'test_user_model@test.com',
      name: 'Test User Model',
      is_admin: false,
    },
    params: {
      id: 0,
    },
    query: {
      withRelated: { },
    },
  };
}

// Delay to wait for migrations/seeds to finish running.

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

  before((done) => {
    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run();
          });
      });

    // Delay to wait for migrations/seeds to finish running.
    setTimeout(() => {
      // Login as admin and set token
      const adminLoginPromise = chai.request(server)
                              .post(`${API_USER_LOGIN_URL}`)
                              .send({
                                username: 'test_user_admin',
                                password: 'password',
                              });
      // Login as regular user and set token
      const userLoginPromise = chai.request(server)
                              .post(`${API_USER_LOGIN_URL}`)
                              .send({
                                username: 'test_user',
                                password: 'password',
                              });
      Promise.all([adminLoginPromise, userLoginPromise]).then((responses) => {
        adminAuthToken = responses[0].body.token;
        userAuthToken = responses[1].body.token;
        done();
      }, (error) => {
        console.error(error);
      });
    }, timeout);
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
          chai.request(server)
          .get(`${API_USER_GET_USER_BY_ID}/4`)
          .set('Authorization', `Bearer ${adminAuthToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.name.should.equal('Test User Model');
            done();
          });
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
  describe('user controller getUserById', () => {
    it('user controller getUserById success', (done) => {
      const mockReq = getMockRegisterUserReq();
      mockReq.params.id = 1;
      const mockRes = new MockExpressResponse();
      UserController.getUserById(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(200);
        const resJSON = mockRes._getJSON();
        resJSON.id.should.equal(1);
        done();
      }, timeout);
    });
    it('user controller getUserById fail', (done) => {
      const mockReq = getMockRegisterUserReq();
      mockReq.params.id = 100;
      const mockRes = new MockExpressResponse();
      UserController.getUserById(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(404);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('NotFound');
        done();
      }, timeout);
    });
  });
});
