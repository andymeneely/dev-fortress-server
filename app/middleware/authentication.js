const auth = require('../lib/authentication');
const User = require('../models/user');
const Team = require('../models/team');

/**
 * Internal helper function.
 * Used to send all error messages.
 * @param {String} statusCode - the HTTP status code to send
 * @param {String} errorType - the error type to include in the body, e.g. 'Forbidden'
 * @param {String} errorMessage - the personal message to include in the body
 * @param {Express.Response} res - the response object
 */
function sendError(statusCode, errorType, errorMessage, res) {
  res.status(statusCode).json({
    error: errorType,
    message: errorMessage,
  });
}

/**
 * Error handler for verifyToken errors
 */
function tokenErrorHandler(err, res) {
  if (err.name === 'TokenExpiredError') {
    sendError(401, 'TokenExpired', 'jwt expired', res);
  } else if (err.name === 'JsonWebTokenError') {
    sendError(401, 'NoToken', 'jwt must be provided', res);
  } else {
    console.error(err);
    sendError(401, 'Unauthorized', 'You are not authenticated', res);
  }
}

/**
 * Verify that a token is valid, thus proving that this user
 * is properly authenticated/logged in
 */
function validateAuthentication(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You are not authenticated.',
    });
  }

  const authMatch = authHeader.match(/Bearer (.*)$/);

  if (!authMatch) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You are not authenticated.',
    });
  }

  return auth.verifyToken(authMatch[1], (err) => {
    if (err) {
      tokenErrorHandler(err, res);
    } else {
      next();
    }
  });
}

/**
 * Internal helper function.
 * Attaches a given User to the request.
 * @param {Express.Request} req - the request object
 * @param {Express.Response} res - the response object
 * @param {String} userId - the id of the User to attach
 */
function attachUser(req, res, userId, next) {
  return User.where('id', userId).fetch({
    withRelated: ['roles'],
  })
    .then((user) => {
      req.user = user.serialize();
      req.userType = 'USER';
      next();
    })
    .catch((fetchErr) => {
      console.error(fetchErr);
      sendError(500, 'Internal Server Error', 'Unknown Error', res);
    });
}

/**
 * Internal helper function.
 * Attaches a given Team to the request.
 * @param {Express.Request} req - the request object
 * @param {Express.Response} res - the response object
 * @param {String} userId - the id of the Team to attach
 */
function attachTeam(req, res, teamId, next) {
  return Team.where('id', teamId).fetch({
    withRelated: ['game'],
  })
    .then((team) => {
      req.team = team.serialize();
      req.userType = 'TEAM';
      next();
    })
    .catch((fetchErr) => {
      console.error(fetchErr);
      sendError(500, 'Internal Server Error', 'Unknown Error', res);
    });
}

function validateAuthenticationAttachEntity(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) return sendError(401, 'Unauthorized', 'You are not authenticated.', res);

  const authMatch = authHeader.match(/Bearer (.*)$/);

  if (!authMatch) return sendError(401, 'Unauthorized', 'You are not authenticated.', res);

  const decoded = auth.verifyToken(authMatch[1]);
  switch (decoded.type) {
    case 'USER':
      return attachUser(req, res, decoded.id, next);
    case 'TEAM':
      return attachTeam(req, res, decoded.id, next);
    default:
      return sendError(500, 'Internal Server Error', 'Invalid or missing field: "type" on jwt token', res);
  }
}

/**
 * Pre-req: validateAuthenticationAttachEntity
 * Ensure that the user is an Administrator.
 */
function verifyAdministrator(req, res, next) {
  /* istanbul ignore if */
  if (!req.user || !req.userType) {
    console.error('validateAuthenticationAttachEntity middleware is a pre-requisite of verifyAdministrator middleware.');
    return sendError(500, 'Internal Server Error', 'The server is configured incorrectly.', res);
  }
  if (!req.user.is_admin || req.userType !== 'USER') {
    return sendError(403, 'Forbidden', 'You must be an Administrator', res);
  }
  return next();
}

/**
 * Pre-req: validateAuthenticationAttachEntity
 * Ensure that the user is in the 'Professor' role.
 */
function verifyProfessor(req, res, next) {
  /* istanbul ignore if */
  if (!req.user || !req.userType || req.userType !== 'USER') {
    console.error('validateAuthenticationAttachEntity middleware is a pre-requisite of verifyAdministrator middleware.');
    return sendError(500, 'Internal Server Error', 'The server is configured incorrectly.', res);
  }
  // If the user is an admin, skip Professor role checking
  if (req.user.is_admin) {
    return next();
  }
  const roles = req.user.roles;
  let isProf = false;

  roles.forEach((role) => {
    if (role.name === 'professor') {
      isProf = true;
    }
  });
  if (isProf) {
    return next();
  }
  return sendError(403, 'Forbidden', 'User must be part of the \'professor\' Role to perform this action', res);
}

/**
 * Pre-req: none
 * Ensure that the Team with a valid link_code exists and attaches it to req.user.
 */
function validateTeamAttachTeam(req, res, next) {
  Team.where('link_code', req.body.link).fetch()
    .then((team) => {
      if (team) {
        req.team = team.serialize();
        req.userType = 'TEAM';
        return next();
      }
      return sendError(404, 'Not Found', 'Could not find a Team associated with that link', res);
    });
}

module.exports = {
  validateAuthentication,
  validateAuthenticationAttachEntity,
  verifyAdministrator,
  verifyProfessor,
  validateTeamAttachTeam,
};
