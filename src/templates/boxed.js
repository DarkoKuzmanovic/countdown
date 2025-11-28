/**
 * Boxed template - Modern countdown with individual boxes
 */

const { escapeHtml } = require("../utils/html");

/**
 * Render the boxed countdown template
 * @param {Array} segments - Countdown segments [{label, value}]
 * @param {string} label - Header label
 * @param {Object} colors - Color configuration
 * @param {string} font - Font stack
 * @param {Object} options - Additional options (radius, fontWeight, padding)
 * @returns {string} SVG string
 */
function renderBoxedTemplate(segments, label, colors, font, options = {}) {
  const { background, box, digits, labelsColor, accent } = colors;
  const radius = options.radius !== undefined ? options.radius : 16;
  const fontWeight = options.fontWeight !== undefined ? options.fontWeight : 700;
  const padding = options.padding !== undefined ? options.padding : 20;
  const outerRadius = Math.min(radius * 1.75, 28);
  const gap = 18;
  const boxWidth = 150;
  const boxHeight = 110;
  const svgWidth = padding * 2 + segments.length * (boxWidth + gap) - gap + gap;
  const hasLabel = label && label.trim().length > 0;
  const svgHeight = hasLabel ? 220 : 160;
  const boxesY = hasLabel ? 75 : 20;
  let cursorX = padding;

  const boxes = segments
    .map((segment) => {
      const block = `<g transform="translate(${cursorX},${boxesY})">
        <rect rx="${radius}" ry="${radius}" width="${boxWidth}" height="${boxHeight}" fill="${box}"></rect>
        <text x="${
          boxWidth / 2
        }" y="60" text-anchor="middle" font-size="42" font-weight="${fontWeight}" fill="${digits}" font-family="${font}">${
        segment.value
      }</text>
        <text x="${
          boxWidth / 2
        }" y="95" text-anchor="middle" font-size="16" letter-spacing="0.2em" fill="${labelsColor}" font-family="${font}" opacity="0.9">${segment.label.toUpperCase()}</text>
      </g>`;
      cursorX += boxWidth + gap;
      return block;
    })
    .join("");

  const headerSection = hasLabel
    ? `<text x="${
        svgWidth / 2
      }" y="48" text-anchor="middle" font-size="26" font-weight="600" fill="${accent}" font-family="${font}">${escapeHtml(
        label
      )}</text>
  <line x1="${svgWidth / 2 - 80}" x2="${
        svgWidth / 2 + 80
      }" y1="60" y2="60" stroke="${accent}" stroke-width="2" stroke-linecap="round" opacity="0.4" />`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="${box}" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${background}" rx="${outerRadius}" ry="${outerRadius}" />
  ${headerSection}
  <g filter="url(#shadow)">${boxes}</g>
</svg>`;
}

module.exports = { renderBoxedTemplate };
