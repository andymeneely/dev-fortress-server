const knex = require('../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('User Login API Tests', () => {
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
  describe('login test_user_admin success', () => {
    it('should succeed login test_user_admin on /api/login POST', (done) => {
      chai.request(server)
        .post('/api/login')
        .send({
          username: 'test_user_admin',
          password: 'password',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('login test_user_admin fail password', () => {
    it('should fail login test_user_admin on /api/login POST', (done) => {
      chai.request(server)
        .post('/api/login')
        .send({
          username: 'test_user_admin',
          password: 'wrong_password',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('login test_user_admin fail username', () => {
    it('should fail login test_wronguser_admin on /api/login POST', (done) => {
      chai.request(server)
        .post('/api/login')
        .send({
          username: 'test_wronguser_admin',
          password: 'password',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
