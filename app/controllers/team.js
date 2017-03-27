/**
 * @module controllers/team
 */

const Team = require('../models/team');
const has = require('has');

/**
 * Internal helper function. Serializes and performs type coercion
 * Returns the serialized and coerced collection.
 */
function serializeAndCoerce(teamCollection) {
  let teamCollectionJson = teamCollection.serialize();
  if (!Array.isArray(teamCollectionJson)) {
    teamCollectionJson = new Array(teamCollectionJson);
  }
  // Type coercion for boolean values
  teamCollectionJson.forEach((team) => {
    team.mature = !!team.mature;
  });
  if (teamCollectionJson.length === 1) return teamCollectionJson[0];
  return teamCollectionJson;
}

/**
 * Internal helper function. Used to send error responses.
 * @param {Integer} statusCode    - the HTTP status code of the response to be sent
 * @param {String} errorMessage   - the error message to return with the response
 * @param {Object} requestBody    - the body of the request to return with the response
 * @param {Express.Response} res  - the response object
 */
function sendError(statusCode, errorMessage, requestBody, res) {
  res.status(statusCode).json({
    error: errorMessage,
    request: requestBody,
  });
}

/**
 * Internal helper function. Sends a BadRequest if the requested name already exists.
 * @param {String} teamName - the name to check the existence of.
 */
function validateNameUnique(teamName) {
  return Team.where('name', teamName).count('name')
    .then(count => (count === 0));
}

/**
 * Create a new Team
 * @param {Express.Request}   req - the request object
 * @param {Express.Response}  res - the response object
 */
function createTeam(req, res) {
  if (!has(req, 'body')) {
    return sendError(400, 'Missing or empty Request Body', {}, res);
  }
  const requestBody = req.body;

  // Check for required fields and other basic validation measures.
  if (!has(requestBody, 'name')) return sendError(400, 'Missing required "name" field.', requestBody, res);
  if (!has(requestBody, 'type_id')) return sendError(400, 'Missing required "type_id" field.', requestBody, res);
  if (!has(requestBody, 'game_id')) return sendError(400, 'Missing required "game_id" field.', requestBody, res);
  if ((has(requestBody, 'resources')) && (requestBody.resources < 0)) return sendError(400, 'Optional "resources" field cannot be negative.', requestBody, res);
  if ((has(requestBody, 'mindset')) && (requestBody.mindset < 0)) return sendError(400, 'Optional "mindset" field cannot be negative.', requestBody, res);

  return validateNameUnique(requestBody.name)
  .then((isValid) => {
    if (!isValid) {
      sendError(400, 'A Team with the requested name already exists.', requestBody, res);
    } else {
      Team.forge(requestBody).save()
      .then(team =>
        // Retrieve the newly created Team and return it in the success response.
        Team.where('id', team.id).fetch()
        .then(newTeam => res.status(201).json(serializeAndCoerce(newTeam)))
      );
    }
  });
}

module.exports = {
  createTeam,
};
