function enableCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  return next();
}

function allowHeaders(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  return next();
}

function allowMethods(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  return next();
}

function handleOptions(req, res, next) {
  if (req.method === 'OPTIONS') {
    // respond with 200
    return res.send(200);
  }
  // move on
  return next();
}

module.exports = {
  enableCORS,
  allowHeaders,
  allowMethods,
  handleOptions,
};
