/**
 * Central utilities exports
 */

const { sanitizeColor, sanitizeFont, sanitizeLabel } = require("./sanitize");
const { escapeHtml, escapeUrl, buildSnippet } = require("./html");
const { dayjs, formatDateTimeLocal, parseInTimezone, now, nowInTimezone } = require("./date");

module.exports = {
  // Sanitization
  sanitizeColor,
  sanitizeFont,
  sanitizeLabel,

  // HTML
  escapeHtml,
  escapeUrl,
  buildSnippet,

  // Date
  dayjs,
  formatDateTimeLocal,
  parseInTimezone,
  now,
  nowInTimezone,
};
