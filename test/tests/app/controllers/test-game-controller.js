const knex = require('../../../../app/lib/db');
const chai = require('chai');
const GameController = require('../../../../app/controllers/game');
const MockExpressResponse = require('mock-express-response');

const should = chai.should();

// Timeout to be used for checking controller responses
const timeout = 250;

function getMockGameReq() {
  return {
    body: {
      name: 'Fall2016-SWEN-331-02',
      max_round: 5,
      current_round: 0,
    },
    user: {
      id: 1,
      is_admin: true,
    },
  };
}

describe('Game Controller Tests', () => {
  describe('Game Creation', () => {
    before((done) => {
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
    after((done) => {
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

    describe('Success', () => {
      it('Professor can create a game with all necessary details.', (done) => {
        const mockReq = getMockGameReq();
        const mockRes = new MockExpressResponse();
        GameController.createGame(mockReq, mockRes);
        setTimeout(() => {
          mockRes.statusCode.should.equal(201);
          const resJSON = mockRes._getJSON();
          resJSON.name.should.equal(mockReq.body.name);
          resJSON.max_round.should.equal(mockReq.body.max_round);
          resJSON.current_round.should.equal(mockReq.body.current_round);
          resJSON.storyteller_id.should.equal(mockReq.user.id);
          done();
        }, timeout);
      });
    });
  });
});
