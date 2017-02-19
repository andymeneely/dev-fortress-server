const knex = require('../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

/* eslint-disable */
const should = chai.should();
/* eslint-enable */

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
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'password',
        })
        .then((res) => {
          res.should.have.status(200);
          // attempt to add role 1 to user 1
          return agent.patch('/api/user/1/roles')
            .set('Authorization', `Bearer ${res.body.token}`)
            .send({
              add: 1,
            })
            .then((response) => {
              response.should.have.status(200);
              done();
            });
        });
    });
  });
});
