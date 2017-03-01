/**
 * @module controllers/teamtype
 */
const TeamType = require('../models/teamtype');

/**
 * Internal helper function. Serializes and performs type coercion
 * Returns the serialized and coerced collection.
 */
function serializeAndCoerce(teamTypeCollection) {
  const teamTypeCollectionJson = teamTypeCollection.serialize();
  // Type coercion for boolean values
  teamTypeCollectionJson.forEach((teamType) => {
    teamType.initial_mature = !!teamType.initial_mature;
    teamType.disabled = !!teamType.disabled;
  });
  return teamTypeCollectionJson;
}

/**
 * Get all TeamTypes in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getTeamTypes(req, res) {
  return TeamType.fetchAll()
  .then((collection) => {
    const teamTypes = serializeAndCoerce(collection);
    res.json(teamTypes);
  })
  .catch((err) => {
    // 404
    if (err.message === 'EmptyResponse') {
      return res.status(404)
      .json({
        error: 'NotFound',
      });
    }
    console.error(err);
    return res.status(500).json({
      error: 'UnknownError',
    });
  });
}

/**
 * Get a TeamType by id parameter
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getTeamTypeById(req, res) {
  return TeamType.where('id', req.params.id).fetch({
    require: true,
  })
  .then((result) => {
    const teamType = serializeAndCoerce(result);
    res.json(teamType);
  })
  .catch((err) => {
    // 404
    if (err.message === 'EmptyResponse') {
      return res.status(404)
      .json({
        error: 'NotFound',
      });
    }
    // Unknown error
    console.error(err);
    return res.status(500)
    .json({
      error: 'UnknownError',
    });
  });
}

/**
 * Create a new TeamType
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 */
function createTeamType(req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      error: '"name" is a required field.',
      request: req.body,
    });
  }
  if (!req.body.description) {
    return res.status(400).json({
      error: '"description" is a required field.',
      request: req.body,
    });
  }
  if (!req.body.initial_mature) {
    return res.status(400).json({
      error: '"initial_mature" is a required field.',
      request: req.body,
    });
  }
  if (!req.body.initial_resources) {
    return res.status(400).json({
      error: '"initial_resources" is a required field.',
      request: req.body,
    });
  }
  if (!req.body.initial_mindset) {
    return res.status(400).json({
      error: '"initial_mindset" is a required field.',
      request: req.body,
    });
  }
  return TeamType.forge(req.body)
    .save().then(teamtype => res.json(teamtype.serialize()))
    .catch((err) => {
      if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({
          error: err,
          request: req.body,
        });
      }
      console.error(err);
      return res.status(500).json({
        error: 'UnknownError',
      });
    });
}


module.exports = {
  getTeamTypes,
  getTeamTypeById,
  createTeamType,
};
