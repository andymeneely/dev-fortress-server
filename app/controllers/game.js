/**
 * @module controllers/game
 */

const Game = require('../models/game');
const User = require('../models/user');
const has = require('has');

/**
 * Internal helper method for validating that a chosen name is unique.
 * @param {String} newName - the requested Game name field value
 */
function validateNameUnique(newName) {
  return Game.where('name', newName).count('name')
    .then(count => (count === 0));
}

/**
 * Get all Games in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 */
function getGames(req, res) {
  return Game.fetchAll()
  .then(collection => res.json(collection.serialize()))
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
      request: req.body,
    });
  });
}

/**
 * Get the Game matching the 'id' param of the request from the database.
 * @param {Express.Request} req   - the request object
 * @param {Express.Response} res  - the response object
 */
function getGameById(req, res) {
  return Game.where('id', req.params.id).fetch()
  .then((game) => {
    if (game) {
      res.status(200).json(game.serialize());
    } else {
      res.status(404).json({
        error: 'Game with the associated ID was not found',
        request: req.params,
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
      request: req.params,
    });
  });
}

/**
 * Pre-req: verifyProfessor middleware
 * Controller to update an existing Game
 * @param {Express.Request} req  - the request object
 * @param {Express.Response} res - the response object
 */
function updateGame(req, res) {
  const gameId = req.params.id;
  const user = req.user;
  const updatedFields = req.body;

  function validateUpdateRequests() {
    if (Object.getOwnPropertyNames(updatedFields).length === 0) {
      res.status(204).send();
      return false;
    }

    if (has(updatedFields, 'id')) {
      res.status(400).json({
        error: 'You may not alter the read-only "id" field',
        request: updatedFields,
      });
      return false;
    }

    if (has(updatedFields, 'max_round')) {
      if (updatedFields.max_round < 0) {
        res.status(400).json({
          error: 'The "max_round" field may not be a negative integer.',
          request: updatedFields,
        });
        return false;
      }
    }

    if (has(updatedFields, 'current_round')) {
      if (updatedFields.current_round < 0) {
        res.status(400).json({
          error: 'The "current_round" field may not be a negative integer.',
          request: updatedFields,
        });
        return false;
      }
    }

    if (has(updatedFields, 'round_phase')) {
      if (updatedFields.round_phase < 0) {
        res.status(400).json({
          error: 'The "round_phase" field may not be a negative integer.',
          request: updatedFields,
        });
        return false;
      }
    }

    if (has(updatedFields, 'created_at')) {
      res.status(400).json({
        error: 'You may not alter the read-only "created_at" field',
        request: updatedFields,
      });
      return false;
    }

    if (has(updatedFields, 'name')) {
      const namePromise = validateNameUnique(updatedFields.name).then((isValid) => {
        if (!isValid) {
          throw new Error('Game with Name exists');
        }
      })
      .catch((err) => {
        if (err.message === 'Game with Name exists') {
          res.status(400).json({
            error: 'There is already a Game with that name. Please choose a unique name.',
            request: updatedFields,
          });
          return false;
        }
        console.error(err);
        res.status(500).json({
          error: 'UnknownError',
          request: updatedFields,
        });
        return false;
      });
      return Promise.resolve(namePromise);
    }

    if (has(updatedFields, 'storyteller_id')) {
      // New storyteller must be is_admin or in Professors role.
      const storytellerId = updatedFields.storyteller_id;
      const existingUserQuery = User.where('id', storytellerId);

      return existingUserQuery.fetch({
        withRelated: ['roles'],
      }).then((targetUser) => {
        if (!targetUser) {
          res.status(400).json({
            error: 'A User whose "id" field matches the "storyteller_id" field of the request could not be found.',
            request: updatedFields,
          });
          return false;
        }
        const targetUserRoles = targetUser.related('roles').toJSON();
        let isProf = false;
        targetUserRoles.forEach((role) => {
          if (role.name === 'Professor') isProf = true;
        });

        if (!isProf && !(targetUser.attributes.is_admin)) {
          res.status(400).json({
            error: 'You cannot make a non-Admin User a storyteller if they are not in the Professor role',
            request: updatedFields,
          });
          return false;
        }
        return true;
      });
    }
    return true;
  }

  // Fetch the game and make sure the storyteller_id matches the user id.
  // If it doesn't, disallow non-admin users from updating.
  let existingGameQuery = Game.where('id', gameId);

  if (!req.user.is_admin) existingGameQuery = existingGameQuery.where('storyteller_id', user.id);
  existingGameQuery.fetch().then((game) => {
    if (!game) {
      res.status(404).json({
        error: 'Game with the associated ID was not found',
        request: req.body,
      });
    } else if (validateUpdateRequests()) {
      game.save(updatedFields)
      .then(() => existingGameQuery.fetch()
      .then((updatedGame) => {
        res.status(200).json(updatedGame.serialize());
      })
      )
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          error: 'UnknownError',
          request: updatedFields,
        });
      });
    }
  });

  Promise.resolve(existingGameQuery);
}

/**
 * Controller to create a new Game
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 */
function createGame(req, res) {
  // Check for required fields
  const newGameReq = req.body;
  if (!has(newGameReq, 'name')) {
    res.status(400).json({
      error: 'Missing required "name" field.',
      request: newGameReq,
    });
    return null;
  }
  if (!has(newGameReq, 'max_round')) {
    res.status(400).json({
      error: 'Missing required "max_round" field.',
      request: newGameReq,
    });
    return null;
  }

  return validateNameUnique(newGameReq.name).then((isValid) => {
    if (!isValid) {
      throw new Error('Game with Name exists');
    } else {
      // Set storyteller to admin/professor making the request
      newGameReq.storyteller_id = req.user.id;

      return Game.forge(newGameReq).save()
      .then(game =>
        // Retrieve the newly created game and return it in the response body.
        Game.where('id', game.id).fetch()
        .then(newGame => res.status(201).json(newGame.serialize()))
      )
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          error: 'UnknownError',
          request: newGameReq,
        });
      });
    }
  })
  .catch((err) => {
    if (err.message === 'Game with Name exists') {
      res.status(400).json({
        error: 'There is already a Game with that name. Please choose a unique name.',
        request: newGameReq,
      });
      return null;
    }
    console.error(err);
    res.status(500).json({
      error: 'UnknownError',
      request: newGameReq,
    });
    return null;
  });
}

module.exports = {
  getGames,
  updateGame,
  getGameById,
  createGame,
};