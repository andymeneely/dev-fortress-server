const chai = require('chai');
const knex = require('../../../../app/lib/db');
const GameEvent = require('../../../../app/models/gameevent');

const should = chai.should();
const assert = chai.assert;

describe('GameEvent', () => {
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
  it('Test Create GameEvent', (done) => {
    const gameEventData = {
      damage: 10,
      round: 1,
      game_id: 1,
      event_id: 1,
    };
    GameEvent.forge(gameEventData).save().then((id) => {
      should.exist(id);
      done();
    }).catch((err) => {
      should.not.exist(err);
    });
  });
  it('Test Get All GameEvent', (done) => {
    GameEvent.fetchAll().then((collection) => {
      const gameEventCollection = collection.serialize();
      gameEventCollection.should.be.an('array');
      assert(gameEventCollection.length > 0);
      done();
    }).catch((err) => {
      should.not.exist(err);
    });
  });
  it('Test Get GameEvent By ID', (done) => {
    const gameEventID = 1;
    GameEvent.where('id', gameEventID).fetch({ withRelated: ['event', 'game'] }).then((gameEvent) => {
      const gameEventJSON = gameEvent.serialize();
      should.exist(gameEventJSON);
      should.exist(gameEventJSON.damage);
      should.exist(gameEventJSON.round);
      should.exist(gameEventJSON.event_id);
      should.exist(gameEventJSON.game_id);
      should.exist(gameEventJSON.event);
      should.exist(gameEventJSON.game);
      gameEventJSON.event.id.should.equal(gameEventJSON.event_id);
      gameEventJSON.game.id.should.equal(gameEventJSON.game_id);
      done();
    }).catch((err) => {
      should.not.exist(err);
    });
  });
});
