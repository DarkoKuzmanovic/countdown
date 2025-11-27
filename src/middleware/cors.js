/**
 * CORS middleware
 */

/**
 * Set CORS headers for timer endpoints
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function corsHeaders(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
}

/**
 * Handle OPTIONS preflight requests
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
function handlePreflight(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
}

module.exports = { corsHeaders, handlePreflight };
