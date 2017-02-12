const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

/* eslint-disable */
const should = chai.should();
/* eslint-enable */

chai.use(chaiHttp);


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
