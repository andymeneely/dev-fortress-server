/**
 * @module /socket/controllers/user
 */
const User = require('../../models/user');

/**
 * Retrieve the User model info and forward it to the callback.
 * @param {Integer} userId the id of the User
 * @param {Function} callback the callback function(userJSON)
 */
function getUserById(userId, callback) {
  User.where('id', userId).fetch().then((user) => {
    let userObj;
    if (user) userObj = user.serialize();
    callback(userObj);
  });
}

module.exports = {
  getUserById,
};
