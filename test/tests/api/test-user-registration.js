const API_USER_REGISTER_URL = require('../../data/constants').API_USER_REGISTER_URL;
const API_USER_LOGIN_URL = require('../../data/constants').API_USER_LOGIN_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();
let adminAuthToken = '';
let userAuthToken = '';

chai.use(chaiHttp);

describe('User Registration API Tests', () => {
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
    }, 500);
  });

  describe('Register with Admin', () => {
    describe('register test_user_registration with admin', () => {
      it(`should succeed register test_user_registration on ${API_USER_REGISTER_URL} POST`, (done) => {
        chai.request(server)
          .post(`${API_USER_REGISTER_URL}`)
          .set('Authorization', `Bearer ${adminAuthToken}`)
          .send({
            username: 'test_user_registration',
            password: 'password_registration',
            email: 'test_registration@test.com',
            name: 'Test User Registration',
            is_admin: false,
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it(`should succeed no_name register test_user_registration on ${API_USER_REGISTER_URL} POST`, (done) => {
        chai.request(server)
          .post(`${API_USER_REGISTER_URL}`)
          .set('Authorization', `Bearer ${adminAuthToken}`)
          .send({
            username: 'test_user_registration',
            password: 'password_registration',
            email: 'test_registration@test.com',
            is_admin: false,
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
    describe('Register with Regular User', () => {
      describe('register test_user_registration with regular user', () => {
        it(`should fail register test_user_registration on ${API_USER_REGISTER_URL} POST`, (done) => {
          chai.request(server)
            .post(`${API_USER_REGISTER_URL}`)
            .set('Authorization', `Bearer ${userAuthToken}`)
            .send({
              username: 'test_user_registration',
              password: 'password_registration',
              email: 'test_registration@test.com',
            })
            .end((err, res) => {
              res.should.have.status(403);
              done();
            });
        });
      });
    });
  });
});
