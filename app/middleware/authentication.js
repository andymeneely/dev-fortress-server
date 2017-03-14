const auth = require('../lib/authentication');
const User = require('../models/user');

/**
 * Error handler for verifyToken errors
 */
function tokenErrorHandler(err, res) {
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'TokenExpired',
      message: 'jwt expired',
    });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'NoToken',
      message: 'jwt must be provided',
    });
  } else {
    console.error(err);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'You are not authenticated.',
    });
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

function validateAuthenticationAttachUser(req, res, next) {
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

  const decoded = auth.verifyToken(authMatch[1]);
  const userId = decoded.userId;

  const userPromise = User.where('id', userId).fetch({
    withRelated: ['roles'],
  })
    .then((user) => {
      req.user = user.serialize();
    })
    .catch((fetchErr) => {
      console.error(fetchErr);
      res.status(500).json({
        error: 'Unknown Error',
      });
    });

  return userPromise.then(next);
}

/**
 * Pre-req: validateAuthenticationAttachUser
 * Ensure that the user is an Administrator.
 */
function verifyAdministrator(req, res, next) {
  if (!req.user) {
    console.error('validateAuthenticationAttachUser middleware is a pre-requisite of verifyAdministrator middleware.');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'The server is configured incorrectly.',
    });
  }
  if (!req.user.is_admin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You must be an Administrator',
    });
  }
  return next();
}

/**
 * Pre-req: validateAuthenticationAttachUser
 * Ensure that the user is in the 'Professor' role.
 */
function verifyProfessor(req, res, next) {
  if (!req.user) {
    console.error('validateAuthenticationAttachUser middleware is a pre-requisite of verifyAdministrator middleware.');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'The server is configured incorrectly.',
    });
  }
  // If the user is an admin, skip Professor role checking
  if (req.user.is_admin) {
    return next();
  }
  const roles = req.user.roles;
  let isProf = false;

  roles.forEach((role) => {
    if (role.name === 'Professor') {
      isProf = true;
    }
  });
  if (isProf) {
    return next();
  }
  return res.status(403).json({
    error: 'Forbidden',
    message: 'User must be part of the \'Professor\' Role to perform this action',
  });
}

module.exports = {
  validateAuthentication,
  validateAuthenticationAttachUser,
  verifyAdministrator,
  verifyProfessor,
};
