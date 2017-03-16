const express = require('express');
const { enableCORS, allowHeaders, allowMethods, handleOptions, redirect } = require('../middleware/utils');

const router = express.Router();

router.use(enableCORS, allowHeaders, allowMethods, handleOptions, redirect);

router.use('/user', require('./user'));
router.use('/role', require('./role'));
router.use('/event', require('./event'));
router.use('/teamtype', require('./teamtype'));
router.use('/rumor', require('./rumor'));


// Generate 404s
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle errors
router.use((err, req, res) => {
  res.status(err.status || 500);
  if (err.status === 500) {
    console.log(err.stack);
  }
  res.json({
    message: err.message,
    error: err.stack,
  });
});

module.exports = router;
