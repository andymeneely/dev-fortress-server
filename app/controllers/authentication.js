const User = require('../models/user');
const authentication = require('../lib/authentication');

/**
 * Pre-req: User is authenticated and model data is attached to req.user
 * Generate a JWT for the user.
 * @param {Express.Request}   req  - the request
 * @param {Express.Response}  res  - the response
 */
function refreshToken(req, res) {
  if (!(req.user)) {
    console.error('No user data attached to req.body. AttachUser middleware is required.');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'The server is configured incorrectly.',
    });
  }
  const tokenData = {
    userId: req.user.id,
  };
  return new Promise((accept, reject) => {
    authentication.signToken(tokenData, (err, theToken) => {
      if (err) {
        reject(err);
      }
      return res.json({
        token: theToken,
      });
    });
  });
}

/**
 * Verify password and generate a JWT for a user
 * @param  {Express.Request}   req  - the request
 * @param  {Express.Resonse}   res  - the response
 * @param  {Function} next - pass to next route handler
 */
function login(req, res) {
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
      return res.status(400).json({
        error: 'BadPassword',
        message: 'Password is incorrect for user',
      });
    }

    // Attach User data to the request. Required by refreshToken
    req.user = userData.attributes;

    return refreshToken(req, res);
  })
  .catch((err) => {
    if (err.message === 'EmptyResponse') {
      return res.status(400)
      .json({
        error: 'NoUser',
        message: 'Username not found',
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

module.exports = {
  login,
  refreshToken,
};
