/**
 * Countdown calculation service
 */

/**
 * Build countdown segments from seconds difference
 * @param {number} diffSeconds - Seconds remaining
 * @param {string} labelStyle - 'short' for D/H/M/S, 'long' for Days/Hours/etc
 * @returns {Array<{label: string, value: string}>} Countdown segments
 */
function buildCountdownSegments(diffSeconds, labelStyle = "long") {
  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const labels =
    labelStyle === "short"
      ? { days: "D", hours: "H", mins: "M", secs: "S" }
      : { days: "Days", hours: "Hours", mins: "Minutes", secs: "Seconds" };

  return [
    { label: labels.days, value: days.toString().padStart(2, "0") },
    { label: labels.hours, value: hours.toString().padStart(2, "0") },
    { label: labels.mins, value: minutes.toString().padStart(2, "0") },
    { label: labels.secs, value: seconds.toString().padStart(2, "0") },
  ];
}

module.exports = { buildCountdownSegments };
