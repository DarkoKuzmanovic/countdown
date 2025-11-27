/**
 * Central middleware exports
 */

const { corsHeaders, handlePreflight } = require("./cors");
const { requestLogger } = require("./logger");

module.exports = {
  corsHeaders,
  handlePreflight,
  requestLogger,
};
