const User = require('../models/user');
const authentication = require('../lib/authentication');
const utils = require('../lib/utils');
const has = require('has');

/**
 * Pre-req: User is authenticated and model data is attached to req.user
 * Generate a JWT for the user.
 * @param {Express.Request}   req  - the request
 * @param {Express.Response}  res  - the response
 */
function refreshToken(req, res) {
  /* istanbul ignore if */
  if (!(req.user) && !(req.team)) {
    console.error('No user or team data attached to req.body. AttachUser or AttachTeam middleware is required.');
    utils.sendError(500, 'The server is configured incorrectly.', {}, res);
  }
  // Set token data specific to the team or user depending on which is attached to the request.
  const tokenId = req.user ? req.user.id : req.team.id;
  const tokenType = req.user ? 'USER' : 'TEAM';
  const tokenData = {
    id: tokenId,
    type: tokenType,
  };
  authentication.signToken(tokenData, (err, theToken) => {
    if (err) {
      console.error('An error occured while signing the refresh token.');
      utils.sendError(500, 'Internal server error', {}, res);
    } else {
      res.status(200).json({
        token: theToken,
      });
    }
  });
}

/**
 * Verify password and generate a JWT for a user
 * @param  {Express.Request}   req  - the request
 * @param  {Express.Resonse}   res  - the response
 * @param  {Function} next - pass to next route handler
 */
function login(req, res) {
  if (!has(req.body, 'username')) {
    return utils.sendError(400, 'Missing required "username" field.', req.body, res);
  }
  if (!has(req.body, 'password')) {
    return utils.sendError(400, 'Missing required "password" field.', req.body, res);
  }
  const userDataPromise = User.where('username', req.body.username.toLowerCase()).fetch({
    require: true,
    withRelated: ['password'],
  });

  const checkPasswordPromise = userDataPromise.then(user =>
    new Promise((accept, reject) => {
      authentication.checkPassword(req.body.password, user.related('password').attributes.password_hash, (err, success) => {
        if (err) {
          return reject(err);
        }
        return accept(success);
      });
    })
  );

  return Promise.all([userDataPromise, checkPasswordPromise])
  .then(([userData, passMatch]) => {
    if (!passMatch) {
      utils.sendError(400, 'Username or password is incorrect.', req.body, res);
    }

    // Attach User data to the request. Required by refreshToken
    req.user = userData.attributes;

    refreshToken(req, res);
  })
  .catch((err) => {
    /* istanbul ignore else */
    if (err.message === 'EmptyResponse') {
      utils.sendError(400, 'Username or password is incorrect.', req.body, res);
    } else {
      // Unknown error
      console.error(err);
      utils.sendError(500, 'An unknown error occured.', req.body, res);
    }
  });
}

module.exports = {
  login,
  refreshToken,
};
