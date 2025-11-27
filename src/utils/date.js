/**
 * Date and time utilities
 */

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

/**
 * Format a date for datetime-local input
 * @param {Date|dayjs.Dayjs} date - The date to format
 * @param {string} zone - The timezone
 * @returns {string} Formatted date string (YYYY-MM-DDTHH:mm)
 */
function formatDateTimeLocal(date, zone) {
  return dayjs(date).tz(zone).format("YYYY-MM-DDTHH:mm");
}

/**
 * Parse a date string in a specific timezone
 * @param {string} dateString - The date string to parse
 * @param {string} zone - The timezone
 * @returns {dayjs.Dayjs} Parsed dayjs object
 */
function parseInTimezone(dateString, zone) {
  return dayjs.tz(dateString, "YYYY-MM-DDTHH:mm", zone);
}

/**
 * Get current time
 * @returns {dayjs.Dayjs} Current dayjs object
 */
function now() {
  return dayjs();
}

/**
 * Get current time in a specific timezone
 * @param {string} zone - The timezone
 * @returns {dayjs.Dayjs} Current dayjs object in the timezone
 */
function nowInTimezone(zone) {
  return dayjs().tz(zone);
}

// Re-export dayjs for direct use if needed
module.exports = {
  dayjs,
  formatDateTimeLocal,
  parseInTimezone,
  now,
  nowInTimezone,
};
