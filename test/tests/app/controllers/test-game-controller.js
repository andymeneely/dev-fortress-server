const knex = require('../../../../app/lib/db');
const chai = require('chai');
const GameController = require('../../../../app/controllers/game');
const MockExpressResponse = require('mock-express-response');
const timeout = require('../../../data/constants').TIMEOUT;

const should = chai.should();
const assert = chai.assert;

function getMockNewGameReq() {
  return {
    body: {
      name: 'Fall2016-SWEN-331-02',
      max_round: 5,
    },
    user: {
      id: 1,
      is_admin: false,
    },
  };
}

function getMockUpdateGameReq() {
  return {
    body: {
      name: 'Fall2017-SWEN-331-02',
    },
    user: {
      id: 1,
      is_admin: false,
    },
    params: {
      id: 1,
    },
  };
}

function getMockNewGameSameNameReq() {
  return {
    body: {
      name: 'Fall2017-SWEN-331-02',
      max_round: 5,
    },
    user: {
      id: 1,
      is_admin: false,
    },
  };
}

describe('Game Controller Tests', () => {
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
      const mockReq = getMockNewGameReq();
      const mockRes = new MockExpressResponse();
      GameController.createGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(201);
        const resJSON = mockRes._getJSON();
        resJSON.name.should.equal(mockReq.body.name);
        resJSON.max_round.should.equal(mockReq.body.max_round);
        resJSON.current_round.should.equal(0);
        resJSON.storyteller_id.should.equal(mockReq.user.id);
        done();
      }, timeout);
    });

    it('A User can retrieve a Game by id.', (done) => {
      const mockReq = {
        params: {
          id: 2,
        },
      };
      const mockRes = new MockExpressResponse();
      GameController.getGameById(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(200);
        const resJSON = mockRes._getJSON();
        const expectedResponse = getMockNewGameReq();
        resJSON.name.should.equal(expectedResponse.body.name);
        resJSON.max_round.should.equal(expectedResponse.body.max_round);
        resJSON.storyteller_id.should.equal(expectedResponse.user.id);
        done();
      }, timeout);
    });

    it('Professor can update an existing game\'s name field.', (done) => {
      const mockReq = getMockUpdateGameReq();
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(200);
        const resJSON = mockRes._getJSON();
        resJSON.id.should.equal(mockReq.params.id);
        resJSON.name.should.equal(mockReq.body.name);
        done();
      }, timeout);
    });

    it('System handles update attempt without updated fields.', (done) => {
      const mockReq = getMockUpdateGameReq();
      delete mockReq.body.name;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(204);
        done();
      }, timeout);
    });

    it('A User can retrieve a list of all Games.', (done) => {
      const mockReq = {};
      const mockRes = new MockExpressResponse();
      GameController.getGames(mockReq, mockRes);
      setTimeout(() => {
        const resJSON = mockRes._getJSON();
        resJSON.length.should.equal(2);
        done();
      }, timeout);
    });
  });

  describe('Fail', () => {
    it('Professor attempts to create a game without a name.', (done) => {
      const mockReq = getMockNewGameReq();
      delete mockReq.body.name;
      const mockRes = new MockExpressResponse();
      GameController.createGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('Missing required "name" field.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to create a game with the empty string as a name.', (done) => {
      const mockReq = getMockNewGameReq();
      mockReq.body.name = '';
      const mockRes = new MockExpressResponse();
      GameController.createGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('"name" field cannot be an empty string.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to create a game without a max_round.', (done) => {
      const mockReq = getMockNewGameReq();
      delete mockReq.body.max_round;
      const mockRes = new MockExpressResponse();
      GameController.createGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('Missing required "max_round" field.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to create a game whose name already exists.', (done) => {
      const mockReq = getMockNewGameSameNameReq();
      const mockRes = new MockExpressResponse();
      GameController.createGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('There is already a Game with that name. Please choose a unique name.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('A User should not be able to query a Game whose id does not exist.', (done) => {
      const mockReq = {
        params: {
          id: 100,
        },
      };
      const mockRes = new MockExpressResponse();
      GameController.getGameById(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(404);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('Game with the associated ID was not found');
        assert.deepEqual(resJSON.request, mockReq.params);
        done();
      }, timeout);
    });

    it('Professor attempts to update an existing game\'s id field.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.body.id = 100;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('You may not alter the read-only "id" field');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to update an existing game\'s max_round field to a value below 0.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.body.max_round = -1;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('The "max_round" field may not be a negative integer.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to update an existing game\'s current_round field to a value below 0.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.body.current_round = -1;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('The "current_round" field may not be a negative integer.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to update an existing game\'s round_phase field to a value below 0.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.body.round_phase = -1;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('The "round_phase" field may not be a negative integer.');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to update an existing game\'s created_at field.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.body.created_at = '1990-10-10 10:14:10';
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(400);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('You may not alter the read-only "created_at" field');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });

    it('Professor attempts to update an game that does not exist.', (done) => {
      const mockReq = getMockUpdateGameReq();
      mockReq.params.id = 100;
      const mockRes = new MockExpressResponse();
      GameController.updateGame(mockReq, mockRes);
      setTimeout(() => {
        mockRes.statusCode.should.equal(404);
        const resJSON = mockRes._getJSON();
        resJSON.error.should.equal('Game with the associated ID was not found');
        assert.deepEqual(resJSON.request, mockReq.body);
        done();
      }, timeout);
    });
  });
});
