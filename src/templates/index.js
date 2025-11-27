/**
 * Template registry and renderer
 */

const { renderBoxedTemplate } = require("./boxed");
const { renderMinimalTemplate } = require("./minimal");
const { renderMinimalNarrowTemplate } = require("./minimal-narrow");

/**
 * Template registry
 */
const templates = {
  boxed: renderBoxedTemplate,
  minimal: renderMinimalTemplate,
  "minimal-narrow": renderMinimalNarrowTemplate,
};

/**
 * Render a countdown template
 * @param {string} templateName - Template identifier
 * @param {Array} segments - Countdown segments [{label, value}]
 * @param {string} label - Header label
 * @param {Object} colors - Color configuration
 * @param {string} font - Font stack
 * @param {Object} options - Additional options (radius)
 * @returns {string} SVG string
 */
function renderTemplate(templateName, segments, label, colors, font, options = {}) {
  const renderer = templates[templateName] || templates.boxed;
  return renderer(segments, label, colors, font, options);
}

/**
 * Get list of available templates
 * @returns {string[]} Template names
 */
function getAvailableTemplates() {
  return Object.keys(templates);
}

module.exports = {
  renderTemplate,
  getAvailableTemplates,
  renderBoxedTemplate,
  renderMinimalTemplate,
  renderMinimalNarrowTemplate,
};
