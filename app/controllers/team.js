/**
 * @module controllers/team
 */

const Team = require('../models/team');
const TeamType = require('../models/teamtype');
const Game = require('../models/game');
const has = require('has');
const randomstring = require('randomstring')

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
 * Internal helper function. Generates a unique LinkCode for a Team
 */
function generateUniqueLinkCode() {
  const linkCode = randomstring.generate(7);
  return Team.where('link_code', linkCode).fetch()
          .then((team) => {
            if (!team) return linkCode;
            return generateUniqueLinkCode();
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

  // Check for required fields
  if (!has(requestBody, 'type_id')) return sendError(400, 'Missing required "type_id" field.', requestBody, res);
  if (!has(requestBody, 'game_id')) return sendError(400, 'Missing required "game_id" field.', requestBody, res);
  if ((has(requestBody, 'resources')) && (requestBody.resources < 0)) return sendError(400, 'Optional "resources" field cannot be negative.', requestBody, res);
  if ((has(requestBody, 'mindset')) && (requestBody.mindset < 0)) return sendError(400, 'Optional "mindset" field cannot be negative.', requestBody, res);

  const gamePromise = Game.where('id', requestBody.game_id).fetch();
  const teamtypePromise = TeamType.where('id', requestBody.type_id).fetch();

  return Promise.all([gamePromise, teamtypePromise]).then((responses) => {
    let game = responses[0];
    let teamtype = responses[1];

    // Ensure that the teamtype and game exist
    if (!game) return sendError(400, 'A Game whose id matches "game_id" in the request body does not exist.', requestBody, res);
    if (!teamtype) return sendError(400, 'A TeamType whose id matches "team_id" in the request body does not exist.', requestBody, res);

    game = game.serialize();
    teamtype = teamtype.serialize();

    if (teamtype.disabled === 1) return sendError(400, 'The TeamType specified by the "type_id" field is disabled and cannot be used.', requestBody, res);
    if (game.current_round === game.max_round) return sendError(400, 'The Game specified by the "game_id" field has ended.', requestBody, res);

    const defaultFields = teamtype;

    // Check for optional fields. Use default values from TeamType if field isn't present.
    if (!has(requestBody, 'name')) requestBody.name = defaultFields.name;
    if (!has(requestBody, 'resources')) requestBody.resources = defaultFields.initial_resources;
    if (!has(requestBody, 'mature')) requestBody.mature = defaultFields.initial_mature;
    if (!has(requestBody, 'mindset')) requestBody.mindset = defaultFields.initial_mindset;

    const uniqueLinkPromise = generateUniqueLinkCode()
    return uniqueLinkPromise.then((linkCode) => {
      requestBody.link_code = linkCode;
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
    })
  });
}

/**
 * Retrive information about a Team given its ID.
 * @param {Express.Request} req  - the request object
 * @param {Express.Response} res - the response object
 */
function getTeamById(req, res) {
  if (!has(req.params, 'id')) return sendError(500, 'The server\'s routes are configured incorrectly.', {}, res);
  return Team.where('id', req.params.id).fetch()
    .then((team) => {
      if (team) res.json(serializeAndCoerce(team));
      else sendError(404, 'The Team specified by the id in the request does not exist.', {}, res);
    });
}

/**
 * Returns a collection of all the Teams in the db.
 * Optionally, include query param 'game_id' to get the Teams for a specific game.
 * @param {Express.Request} req  - the request object
 * @param {Express.Response} res - the response object
 */
function getTeams(req, res) {
  let getTeamsPromise = null;
  if (has(req.query, 'game_id')) {
    getTeamsPromise = Team.where('game_id', req.query.game_id).fetchAll();
  } else {
    getTeamsPromise = Team.fetchAll();
  }
  return getTeamsPromise.then(collection => res.json(serializeAndCoerce(collection)));
}

/**
 * Update an existing Team
 * @param {Express.Request} req  - the request object
 * @param {Express.Response} res - the response object
 */
function updateExistingTeam(req, res) {
  if (!has(req.params, 'id')) return sendError(500, 'The server is configured incorrectly.', req.body, res);
  // if (!has(req, 'user')) {
  //   return sendError(500, 'The server is configured incorrectly. No User attached to request.', req.body, res);
  // }

  const teamId = req.params.id;
  // const user = req.user;

  const teamPromise = Team.where('id', teamId).fetch({
    withRelated: ['game'],
  });

  return teamPromise.then((team) => {
    if (team) {
      const updatedFields = req.body;
      // const teamObject = team.serialize();
      // if ((teamObject.game.storyteller_id !== user.id) && !(user.is_admin)) {
      //   return sendError(403, 'Only the Storyteller of this Team\'s Game or an Admin may update the Team.', updatedFields, res);
      // }
      if ((has(updatedFields, 'resources')) && (updatedFields.resources < 0)) return sendError(400, 'Optional "resources" field cannot be negative.', updatedFields, res);
      if ((has(updatedFields, 'mindset')) && (updatedFields.mindset < 0)) return sendError(400, 'Optional "mindset" field cannot be negative.', updatedFields, res);

      // Don't allow certain fields to be changed.
      if (has(updatedFields, 'game_id')) return sendError(400, 'The "game_id" field may not be modified for an existing Team.', updatedFields, res);
      if (has(updatedFields, 'type_id')) return sendError(400, 'The "type_id" field may not be modified for an existing Team.', updatedFields, res);

      return team.save(updatedFields)
        .then(() => Team.where('id', teamId).fetch())
        .then(updatedTeam => res.json(serializeAndCoerce(updatedTeam)));
    }
    return sendError(404, 'The Team specified by the id in the request does not exist.', req.body, res);
  });
}


module.exports = {
  createTeam,
  getTeamById,
  getTeams,
  updateExistingTeam,
};
