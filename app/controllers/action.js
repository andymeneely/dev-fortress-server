/**
 * @module controllers/action
 */
const Action = require('../models/action');
const utils = require('../lib/utils');

/**
 * Get all Actions from the database and return them as an array.
 * @param {Express.Request} req the request object
 * @param {Express.Response} res the response object
 */
function getActions(req, res) {
  return Action.fetchAll()
    .then(collection => res.json(collection.serialize()))
    .catch(
      /* istanbul ignore next */
      (err) => {
        console.error(err);
        utils.sendError(500, 'UnknownError', {}, res);
        return null;
      }
    );
}

/**
 * Get an Action by its ID. Return the JSON serialized action or 404 if not found.
 * @param {Express.Request} req the request object
 * @param {Express.Response} res the response object
 */
function getActionById(req, res) {
  let actionId;

  /* istanbul ignore else */
  if (req.params && req.params.id) {
    actionId = req.params.id;
  } else {
    utils.sendError(500, 'The Server\'s routes are configured incorrectly.', {}, res);
    return null;
  }

  return Action.where('id', actionId).fetch()
    .then((action) => {
      if (!action) {
        // 404 not found
        utils.sendError(404, 'The requested Action could not be found', { params: req.params }, res);
      } else {
        res.json(action.serialize());
      }
    });
}

module.exports = {
  getActions,
  getActionById,
};
