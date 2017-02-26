const API_LOGIN_URL = require('../../data/constants').API_LOGIN_URL;
const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('User Role API Test', () => {
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

  describe('user role update on /api/user/:id/role', () => {
    it('should succeed user role update on /api/user/:id/role', (done) => {
      const agent = chai.request.agent(server);

      // login and get a token
      agent
        .post(`${API_LOGIN_URL}`)
        .send({
          username: 'test_user_admin',
          password: 'password',
        })
        .then((res) => {
          res.should.have.status(200);
          // attempt to add role 1 to user 1
          return agent.patch('/api/user/1/roles')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send({
              add: {
                role_id: 1,
              },
            })
            .then((response) => {
              response.should.have.status(200);
              done();
            });
        });
    });
    it('should fail user role update on /api/user/:id/role', (done) => {
      const agent = chai.request.agent(server);

      // login and get a token
      agent
        .post(`${API_LOGIN_URL}`)
        .send({
          username: 'test_user',
          password: 'password',
        })
        .then((res) => {
          res.should.have.status(200);
          // attempt to add role 1 to user 1
          return agent.patch('/api/user/1/roles')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send({
              add: {
                role_id: 1,
              },
            })
            .catch((error) => {
              error.should.have.status(403);
              done();
            });
        });
    });
  });
});
