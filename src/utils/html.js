/**
 * HTML utilities
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {any} value - The value to escape
 * @returns {string} Escaped string
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Escape a URL for safe use in HTML attributes
 * Validates URL structure and escapes special characters
 * @param {string} url - The URL to escape
 * @returns {string} Escaped URL safe for HTML attributes
 */
function escapeUrl(url) {
  if (typeof url !== "string") return "";

  // Basic URL validation - must start with http://, https://, or be relative
  const trimmed = url.trim();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
    return "";
  }

  return escapeHtml(trimmed);
}

/**
 * Build an HTML image snippet for email embedding
 * @param {string} imageUrl - The image URL
 * @param {string} label - Alt text label
 * @returns {string} HTML img tag
 */
function buildSnippet(imageUrl, label) {
  const escapedLabel = escapeHtml(label);
  const escapedUrl = escapeUrl(imageUrl);
  return `<img src="${escapedUrl}" alt="${escapedLabel}" width="600" style="display:block;max-width:100%;height:auto;border:0;">`;
}

module.exports = {
  escapeHtml,
  escapeUrl,
  buildSnippet,
};
