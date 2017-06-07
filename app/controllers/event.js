/**
 * @module controllers/event
 */
const Event = require('../models/event');
const bookshelf = require('../lib/bookshelf');
const utils = require('../lib/utils');
const has = require('has');

/**
 * Get all events in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getEvents(req, res) {
  return Event.fetchAll()
  .then(collection => res.json(collection.serialize()))
    .catch((err) => {
      /* istanbul ignore next */
      console.error(err);
      utils.sendError(500, 'An unknown error occured.', req.body, res);
    }
  );
}

/**
 * Get a Event in the database by id
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getEventById(req, res) {
  if (!has(req.params, 'id')) {
    return utils.sendError(500, 'The server is configured incorrectly. Query param "id" required for this request.', {}, res);
  }
  return Event.where('id', req.params.id).fetch({
    require: true,
  })
  .then(event => res.json(event.serialize()))
  .catch((err) => {
    /* istanbul ignore else */
    if (err.message === 'EmptyResponse') {
      // 404
      utils.sendError(404, 'An Event with that ID could not be found.', req.params, res);
    } else {
      // Unknown error
      console.error(err);
      utils.sendError(500, 'An unknown error occured.', req.params, res);
    }
  });
}

/**
 * Create a Event
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function createEvent(req, res) {
  const eventData = {};
  // validate request
  if (!has(req.body, 'name')) {
    return utils.sendError(400, 'Missing required "name" field.', req.body, res);
  }
  if (!has(req.body, 'description')) {
    return utils.sendError(400, 'Missing required "description" field.', req.body, res);
  }
  if (!has(req.body, 'default_damage')) {
    return utils.sendError(400, 'Missing required "default_damage" field.', req.body, res);
  }

  eventData.name = req.body.name;
  eventData.description = req.body.description;
  eventData.default_damage = req.body.default_damage;

  return bookshelf.transaction((t) => {
    // check if name exists
    const eventExistsPromise = Event.where('name', eventData.name)
    .count('id', { transacting: t })
    .tap((count) => {
      if (parseInt(count, 10) !== 0) {
        throw new Error('A event with that name already exists.');
      }
    });
    function saveEvent() {
      return Event.forge(eventData)
      .save(null, { transacting: t });
    }
    return Promise.all([eventExistsPromise])
    .then(saveEvent);
  })
  .then(event =>
    res.json({
      id: event.id,
      name: event.name,
      description: event.description,
      default_damage: event.default_damage,
    })
  )
  .catch((err) => {
    /* istanbul ignore else */
    if (err.message === 'A event with that name already exists.') {
      // Name exists
      utils.sendError(400, err.message, req.body, res);
    } else {
      console.error(err);
      utils.sendError(500, 'An unknown error occured.', req.body, res);
    }
  });
}
/**
 * Update a Event in the database by id
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function updateEvent(req, res) {
  if (!has(req.params, 'id')) {
    utils.sendError(400, 'Missing required "id" query param.', req.body, res);
  }
  const targetEvent = Event.forge({ id: req.params.id });
  targetEvent.fetch()
    .then(event =>
      bookshelf.transaction(t =>
        event.save(req.body, { transacting: t })
      )
    )
    .then(() => {
      targetEvent.fetch()
        .then((updatedEvent) => {
          res.status(200).json(updatedEvent);
        })
        .catch(
          /* istanbul ignore next */
          (err) => {
            console.error(err);
            utils.sendError(500, 'An unknown error occured.', req.body, res);
          }
        );
    });
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
};
