const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

/* eslint-disable */
const should = chai.should();
/* eslint-enable */

chai.use(chaiHttp);

describe('register test_user_registration success', () => {
  it('should succeed register test_user_registration on /api/user POST', (done) => {
    chai.request(server)
      .post('/api/user')
      .send({
        username: 'test_user_registration',
        password: 'password_registration',
        email: 'test_registration@test.com',
        name: 'Test User Registration',
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
