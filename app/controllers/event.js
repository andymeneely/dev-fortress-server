/**
 * @module controllers/event
 */
const Event = require('../models/event');
const bookshelf = require('../lib/bookshelf');

const has = require('has');

/**
 * Get all events in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getEvents(req, res) {
  return Event.fetchAll()
  .then(collection => res.json(collection.serialize()))
  .catch(err => console.error(err));
}

/**
 * Get a Event in the database by id
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getEventById(req, res) {
  return Event.where('id', req.params.id).fetch({
    require: true,
    withRelated: req.query.withRelated,
  })
  .then(user => res.json(user.serialize()))
  .catch((err) => {
    // 404
    if (err.message === 'EmptyResponse') {
      return res.status(404)
      .json({
        error: 'NotFound',
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

function createEvent(req, res) {
  const eventData = {};
  // validate request
  if (!has(req.body, 'name')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'name field is missing',
    });
  }
  if (!has(req.body, 'description')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'description field is missing',
    });
  }
  if (!has(req.body, 'default_damage')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'default_damage field is missing',
    });
  }
  if (!has(req.body, 'disabled')) {
    eventData.disabled = false;
  } else if (req.body.disabled === true) {
    eventData.disabled = true;
  } else {
    eventData.disabled = false;
  }

  eventData.name = req.body.name;
  eventData.description = req.body.description;
  eventData.default_damage = req.body.default_damage;

  return bookshelf.transaction((t) => {
    // check if name exists
    const eventExistsPromise = Event.where('name', eventData.name)
    .count('id', { transacting: t })
    .tap((count) => {
      if (count !== 0) {
        throw new Error('A event with that name already exists.');
      }
    });
    return Promise.all([eventExistsPromise]);
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
    // name exists
    if (err.message === 'A event with that name already exists.') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500)
    .json({
      error: 'UnknownError',
    });
  });
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
};
