/**
 * @module controllers/rumor
 */
const Rumor = require('../models/rumor');
const bookshelf = require('../lib/bookshelf');

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
  return Rumor.where('id', req.params.id).fetch({
    require: true,
    withRelated: req.query.withRelated,
  })
  .then((rumor) => {
    const rumorJson = serializeAndCoerce(rumor)[0];
    return res.json(rumorJson);
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).json({
      error: err,
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
  if (!newRumorData.name) {
    res.status(400).json({
      error: '"name" is a required field.',
      request: newRumorData,
    });
  }
  if (!newRumorData.description) {
    res.status(400).json({
      error: '"description" is a required field.',
      request: newRumorData,
    });
  }
  Rumor.forge(newRumorData)
    .save().then(rumor => res.json(serializeAndCoerce(rumor)[0]))
    .catch((err) => {
      if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
        res.status(409).json({
          error: err,
          request: newRumorData,
        });
      }
      console.error(err);
      res.status(500).json({
        error: 'UnknownError',
        request: newRumorData,
      });
    });
}

module.exports = {
  updateExistingRumor,
  getRumors,
  getRumorById,
  createRumor,
};
