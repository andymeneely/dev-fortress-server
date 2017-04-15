/**
 * @module controllers/mitigation
 */
const Mitigation = require('../models/mitigation');
const util = require('../lib/utils');
const has = require('has');

/**
 * Get all Mitigations in the database
 * @param {Express.Request}  req   the request object
 * @param {Express.Response} res   the response object
 */
function getMitigations(req, res) {
  let mitigationQuery = Mitigation;
  const fetchBody = {};
  if (has(req, 'query')) {
    if (has(req.query, 'withRelated')) fetchBody.withRelated = req.query.withRelated;
    if (has(req.query, 'event_id')) mitigationQuery = mitigationQuery.where('event_id', req.query.event_id);
  }
  return mitigationQuery.fetchAll(fetchBody)
  .then((collection) => {
    if (collection.length === 0) {
      util.sendError(404, 'Mitigations with the specified Event ID query param could not be found.', {}, res);
    } else {
      res.json(collection.serialize());
    }
  })
  .catch(
    /* istanbul ignore next */
    (err) => {
      console.error(err);
      util.sendError(500, 'Unknown Error: Internal Server Error.', {}, res);
    }
  );
}

function getMitigationById(req, res) {
  let mitigationQuery = Mitigation;
  const fetchBody = {};
  if (has(req, 'query')) {
    if (has(req.query, 'withRelated')) fetchBody.withRelated = req.query.withRelated;
  }
  /* istanbul ignore next */
  if (!has(req, 'params') || !has(req.params, 'id')) {
    return util.sendError(500, 'The server is configured incorrectly.', {}, res);
  }
  mitigationQuery = mitigationQuery.where('id', req.params.id);
  return mitigationQuery.fetch(fetchBody)
    .then((mitigation) => {
      if (mitigation) {
        res.status(200).json(mitigation.serialize());
      } else {
        util.sendError(404, 'A Mitigation matching that ID could not be found.', {}, res);
      }
    })
    .catch(
      /* istanbul ignore next */
      (err) => {
        console.error(err);
        util.sendError(500, 'Unknown Error: Internal Server Error.', {}, res);
      }
    );
}

module.exports = {
  getMitigations,
  getMitigationById,
};
