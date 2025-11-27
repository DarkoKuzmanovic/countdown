/**
 * Input sanitization utilities
 */

const { MAX_LABEL_LENGTH } = require("../config/constants");

/**
 * Sanitize and validate a color input
 * @param {any} input - The input value
 * @param {string} fallback - Fallback color if input is invalid
 * @returns {string} Valid hex color
 */
function sanitizeColor(input, fallback) {
  if (typeof input !== "string") return fallback;
  let value = input.trim();
  if (!value) return fallback;
  if (!value.startsWith("#")) {
    value = `#${value}`;
  }
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
    return value;
  }
  return fallback;
}

/**
 * Sanitize a font stack input
 * @param {any} input - The input value
 * @param {string} fallback - Fallback font stack if input is invalid
 * @returns {string} Sanitized font stack
 */
function sanitizeFont(input, fallback) {
  if (typeof input !== "string") return fallback;
  const cleaned = input.replace(/[^a-zA-Z0-9,\-\s]/g, "").trim();
  return cleaned || fallback;
}

/**
 * Sanitize a label input
 * @param {any} input - The input value
 * @param {string} fallback - Fallback label if input is invalid
 * @returns {string} Sanitized label
 */
function sanitizeLabel(input, fallback) {
  if (typeof input !== "string") return fallback;
  const trimmed = input.trim();
  // Allow empty string if explicitly provided, only use fallback if undefined/null
  if (trimmed === "" && input !== undefined) return "";
  return trimmed ? trimmed.slice(0, MAX_LABEL_LENGTH) : fallback;
}

module.exports = {
  sanitizeColor,
  sanitizeFont,
  sanitizeLabel,
};
