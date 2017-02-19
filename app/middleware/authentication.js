const auth = require('../lib/authentication');

/**
 * Error handler for verifyToken errors
 */
function tokenErrorHandler(err, res) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'TokenExpired',
      message: 'jwt expired',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'NoToken',
      message: 'jwt must be provided',
    });
  }
  console.log(err);
  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You are not authenticated.',
  });
}

/**
 * Verify that a token is valid, thus proving that this user
 * is properly authenticated/logged in
 */
function validateAuthentication(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).send({
      error: 'Unauthorized',
      message: 'You are not authenticated.',
    });
  }

  const authMatch = authHeader.match(/Bearer (.*)$/);

  if (!authMatch) {
    return res.status(401).send({
      error: 'Unauthorized',
      message: 'You are not authenticated.',
    });
  }

  return auth.verifyToken(authMatch[1], (err) => {
    if (err) {
      tokenErrorHandler(err, res);
    }

    return next();
  });
}

/**
 * Verify the user token, and ensure that the user is an Administrator.
 */
function verifyAdministrator(req, res, next) {
  const authHeader = req.get('Authorization');
  const authMatch = authHeader.match(/Bearer (.*)$/);

  // Decoded is the decoded JWT token returned upon successful verification
  return auth.verifyToken(authMatch[1], (err, decoded) => {
    if (err) {
      tokenErrorHandler(err, res);
    }
    if (!(decoded.is_admin)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You must be an Administrator',
      });
    }
    return next();
  });
}


module.exports = {
  validateAuthentication,
  verifyAdministrator,
};
