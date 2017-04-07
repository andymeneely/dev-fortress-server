/**
 * @module lib/utils
 */

/**
 * Send an error message response.
 * @param {Integer} statusCode the HTTP status code to respond with.
 * @param {String} errorMessage the message to include in the 'error' field of the response body.
 * @param {Express.Response} response the Response object
 */
function sendError(statusCode, errorMessage, requestBody, response) {
  response.status(statusCode).json({
    error: errorMessage,
    request: requestBody,
  });
}

module.exports = {
  sendError,
};
