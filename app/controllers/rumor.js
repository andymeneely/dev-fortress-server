/**
 * @module controllers/rumor
 */
const Rumor = require('../models/rumor');
const Event = require('../models/event');
const bookshelf = require('../lib/bookshelf');

const has = require('has');

/**
 * Internal helper function. Serializes and performs type coercion
 * Returns the serialized and coerced collection.
 */
function serializeAndCoerce(rumorCollection) {
  let rumorCollectionJson = rumorCollection.serialize();
  if (!Array.isArray(rumorCollectionJson)) {
    rumorCollectionJson = new Array(rumorCollectionJson);
  }
  // Type coercion for boolean values
  rumorCollectionJson.forEach((rumor) => {
    rumor.disabled = !!rumor.disabled;
  });
  return rumorCollectionJson;
}

/**
 * Update an existing Rumor
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function updateExistingRumor(req, res) {
  const rumorUpdates = req.body;

  if (rumorUpdates.event_id) {
    res.status(400).json({
      error: 'You may not edit the "event_id" field.',
      request: rumorUpdates,
    });
  }

  const targetRumor = Rumor.forge({ id: req.params.id });
  targetRumor.fetch()
    .then(rumor =>
      bookshelf.transaction(t =>
        rumor.save(rumorUpdates, { transacting: t })
      )
    )
    .then(() => {
      targetRumor.fetch()
        .then((updatedRumor) => {
          res.status(200).send(serializeAndCoerce(updatedRumor)[0]);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            error: 'UnknownError',
            request: req.body,
          });
        });
    });
}

/**
 * Get all Rumors in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getRumors(req, res) {
  return Rumor.fetchAll()
  .then((collection) => {
    const rumors = serializeAndCoerce(collection);
    res.json(rumors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
    });
  });
}

/**
 * Get a Rumor by id parameter
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getRumorById(req, res) {
  return Rumor.where('id', req.params.id).fetch()
  .then((rumor) => {
    if (!rumor) {
      res.status(404).send({
        error: 'A Rumor with that ID does not exist.',
        request: req,
      });
    } else {
      const rumorJson = serializeAndCoerce(rumor)[0];
      res.send(rumorJson);
    }
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send({
      error: err,
      request: req,
    });
  });
}

/**
 * Create a new Rumor
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 */
function createRumor(req, res) {
  const newRumorData = req.body;
  if (!has(newRumorData, 'name')) {
    return res.status(400).json({
      error: '"name" is a required field.',
      request: newRumorData,
    });
  }
  if (!has(newRumorData, 'description')) {
    return res.status(400).json({
      error: '"description" is a required field.',
      request: newRumorData,
    });
  }
  if (!has(newRumorData, 'event_id')) {
    return res.status(400).json({
      error: '"event_id" is a required field.',
      request: newRumorData,
    });
  }
  return Event.where('id', newRumorData.event_id).fetch({
    require: true,
  })
  .then(() => {
    // The event exists, forge the Rumor.
    Rumor.forge(newRumorData)
      .save().then(rumor => res.json(serializeAndCoerce(rumor)[0]))
      .catch((err) => {
        if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({
            error: err,
            request: newRumorData,
          });
        }
        console.error(err);
        return res.status(500).json({
          error: 'UnknownError',
          request: newRumorData,
        });
      });
  }, (reason) => {
    // Promise rejected.
    if (reason.message === 'EmptyResponse') {
      return res.status(400).json({
        error: 'The Event represented by event_id does not exist.',
        request: newRumorData,
      });
    }
    console.error(reason);
    return res.status(500).json({
      error: 'UnknownError',
      requst: newRumorData,
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

module.exports = {
  updateExistingRumor,
  getRumors,
  getRumorById,
  createRumor,
};
