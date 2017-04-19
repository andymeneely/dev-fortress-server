const API_USER_LOGIN_URL = require('../../data/constants').API_USER_LOGIN_URL;
const API_MITIGATION_GET_MITIGATIONS_URL = require('../../data/constants').API_MITIGATION_GET_MITIGATIONS_URL;
const API_MITIGATION_GET_MITIGATION_BY_ID_URL = require('../../data/constants').API_MITIGATION_GET_MITIGATION_BY_ID_URL;

const knex = require('../../../app/lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');

const should = chai.should();

chai.use(chaiHttp);
let userToken;

describe('Mitigation Retrieval API Tests', () => {
  before((done) => {
    function loginAsUser() {
      chai.request(server)
          .post(`${API_USER_LOGIN_URL}`)
          .send({
            username: 'test_user',
            password: 'password',
          })
          .end((err, res) => {
            userToken = res.body.token;
            done();
          });
    }
    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => loginAsUser());
          });
      });
  });

  describe('Success', () => {
    it('A User can retrieve all Mitigations', (done) => {
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATIONS_URL}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.should.be.an('array');
          done();
        });
    });
    it('A User can retrieve all Mitigations withRelated Event', (done) => {
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATIONS_URL}`)
        .query({ withRelated: 'event' })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.should.be.an('array');
          res.body.forEach((mitigation) => {
            should.exist(mitigation.event);
            should.exist(mitigation.event.id);
            mitigation.event_id.should.equal(mitigation.event.id);
          });
          done();
        });
    });
    it('A User can retrieve a Mitigation by ID', (done) => {
      const mitigationId = 1;
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATION_BY_ID_URL}${mitigationId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.id.should.equal(mitigationId);
          res.body.type.should.be.a('string');
          done();
        });
    });
    it('A User can retrieve a Mitigation by ID withRelated Event', (done) => {
      const mitigationId = 1;
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATION_BY_ID_URL}${mitigationId}`)
        .query({ withRelated: 'event' })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.id.should.equal(mitigationId);
          res.body.type.should.be.a('string');
          should.exist(res.body.event);
          should.exist(res.body.event.id);
          res.body.event_id.should.equal(res.body.event.id);
          done();
        });
    });
    it('A User can retrieve all Mitigations for an Event ID', (done) => {
      const eventId = 1;
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATIONS_URL}`)
        .query({ event_id: eventId })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.should.be.an('array');
          res.body.forEach((mitigation) => {
            mitigation.event_id.should.equal(eventId);
          });
          done();
        });
    });
  });

  describe('Fail', () => {
    it('A User cannot retrieve a Mitigation whose ID does not exist', (done) => {
      const mitigationId = 100;
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATION_BY_ID_URL}${mitigationId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.exist(err);
          res.statusCode.should.equal(404);
          res.body.error.should.equal('A Mitigation matching that ID could not be found.');
          done();
        });
    });
    it('A User cannot retrieve Mitigations whose Event ID does not exist', (done) => {
      const eventId = 100;
      chai.request(server)
        .get(`${API_MITIGATION_GET_MITIGATIONS_URL}`)
        .query({ event_id: eventId })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.exist(err);
          res.statusCode.should.equal(404);
          res.body.error.should.equal('Mitigations with the specified Event ID query param could not be found.');
          done();
        });
    });
  });

});
