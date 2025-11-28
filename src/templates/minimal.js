/**
 * Minimal template - Clean countdown without boxes
 */

const { escapeHtml } = require("../utils/html");

/**
 * Render the minimal countdown template
 * @param {Array} segments - Countdown segments [{label, value}]
 * @param {string} label - Header label
 * @param {Object} colors - Color configuration
 * @param {string} font - Font stack
 * @param {Object} options - Additional options (radius, fontWeight, padding)
 * @returns {string} SVG string
 */
function renderMinimalTemplate(segments, label, colors, font, options = {}) {
  const { background, digits, labelsColor, accent } = colors;
  const radius = options.radius !== undefined ? options.radius : 24;
  const fontWeight = options.fontWeight !== undefined ? options.fontWeight : 700;
  const padding = options.padding !== undefined ? options.padding : 30;
  const segmentWidth = 110;
  const separatorWidth = 30;
  const svgWidth = padding * 2 + segments.length * segmentWidth + (segments.length - 1) * separatorWidth;
  const hasLabel = label && label.trim().length > 0;
  const svgHeight = hasLabel ? 180 : 140;
  const itemsY = hasLabel ? 60 : 30;
  let cursorX = padding;

  const items = [];
  segments.forEach((segment, index) => {
    items.push(`<g transform="translate(${cursorX},${itemsY})">
      <text x="${
        segmentWidth / 2
      }" y="50" text-anchor="middle" font-size="52" font-weight="${fontWeight}" fill="${digits}" font-family="${font}">${
      segment.value
    }</text>
      <text x="${
        segmentWidth / 2
      }" y="85" text-anchor="middle" font-size="14" letter-spacing="0.1em" fill="${labelsColor}" font-family="${font}" opacity="0.8">${segment.label.toUpperCase()}</text>
    </g>`);

    cursorX += segmentWidth;
    if (index < segments.length - 1) {
      const separatorY = itemsY + 50;
      items.push(
        `<text x="${
          cursorX + separatorWidth / 2
        }" y="${separatorY}" text-anchor="middle" font-size="36" font-weight="300" fill="${accent}" font-family="${font}" opacity="0.5">:</text>`
      );
      cursorX += separatorWidth;
    }
  });

  const headerSection = hasLabel
    ? `<text x="${
        svgWidth / 2
      }" y="35" text-anchor="middle" font-size="22" font-weight="600" fill="${accent}" font-family="${font}">${escapeHtml(
        label
      )}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${background}" rx="${radius}" ry="${radius}" />
  ${headerSection}
  ${items.join("\n  ")}
</svg>`;
}

module.exports = { renderMinimalTemplate };
