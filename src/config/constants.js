/**
 * Application constants
 */

/** Cache TTL for PNG images in milliseconds */
const CACHE_TTL = 5000;

/** Valid template identifiers */
const VALID_TEMPLATES = ["boxed", "minimal", "minimal-narrow"];

/** Default template */
const DEFAULT_TEMPLATE = "boxed";

/** Maximum label length */
const MAX_LABEL_LENGTH = 60;

/** Server port */
const PORT = process.env.PORT || 3000;

module.exports = {
  CACHE_TTL,
  VALID_TEMPLATES,
  DEFAULT_TEMPLATE,
  MAX_LABEL_LENGTH,
  PORT,
};
