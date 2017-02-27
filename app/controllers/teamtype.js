/**
 * @module controllers/teamtype
 */
const TeamType = require('../models/teamtype');

/**
 * Get all TeamTypes in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getTeamTypes(req, res) {
  return TeamType.fetchAll()
  .then(collection => res.json(collection.serialize()))
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
    });
  });
}

/**
 * Create a new TeamType
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function createTeamType(req, res) {
  return TeamType.forge(req.body)
  .save().then(teamtype => res.json(teamtype.serialize()))
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
    });
  });
}


module.exports = {
  getTeamTypes,
  createTeamType,
};
