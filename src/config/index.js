/**
 * Central configuration exports
 */

const { DEFAULT_STYLE } = require("./defaults");
const { TIMEZONES, FALLBACK_TIMEZONES } = require("./timezones");
const { CACHE_TTL, VALID_TEMPLATES, DEFAULT_TEMPLATE, MAX_LABEL_LENGTH, PORT } = require("./constants");

module.exports = {
  DEFAULT_STYLE,
  TIMEZONES,
  FALLBACK_TIMEZONES,
  CACHE_TTL,
  VALID_TEMPLATES,
  DEFAULT_TEMPLATE,
  MAX_LABEL_LENGTH,
  PORT,
};
