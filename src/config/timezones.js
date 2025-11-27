/**
 * Timezone configuration and detection
 */

const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Amsterdam",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

/**
 * Get all available timezones, using Intl API if available
 * @returns {string[]} Sorted array of timezone identifiers
 */
const TIMEZONES = (() => {
  if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone").sort((a, b) => a.localeCompare(b));
    } catch (error) {
      return FALLBACK_TIMEZONES;
    }
  }
  return FALLBACK_TIMEZONES;
})();

module.exports = { TIMEZONES, FALLBACK_TIMEZONES };
