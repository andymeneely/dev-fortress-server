const CONSTANTS = require('../../../data/constants');
const gameController = require('../../../../app/socket/controllers/game');
const knex = require('../../../../app/lib/db');
const redis = require('../../../../app/redis');
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');

chai.use(chaiHttp);
const should = chai.should();

describe.only('Game Socket Functions: ', () => {
  before((done) => {
    // Run initial migrations and seed db
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => done());
          });
      });
  });
  it('Should Pass Socket next_round', (done) => {
    gameController.nextRound(1, () => {
      setTimeout(() => {
        gameController.getGameById(1, (game) => {
          game.round_phase.should.equal(0);
          game.current_round.should.equal(1);
          redis.get('game_1_pending_actions').then((pendingActions) => {
            assert.deepEqual(JSON.parse(pendingActions), {});
            done();
          });
        });
      }, CONSTANTS.TIMEOUT);
    });
  });
  it('Should Pass Socket start_game', (done) => {
    gameController.startGame(1, () => {
      setTimeout(() => {
        gameController.getGameById(1, (game) => {
          game.round_phase.should.equal(0);
          game.current_round.should.equal(1);
          done();
        });
      }, CONSTANTS.TIMEOUT);
    });
  });
});
