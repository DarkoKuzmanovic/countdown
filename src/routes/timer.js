/**
 * Timer image routes (SVG and PNG)
 */

const express = require("express");
const sharp = require("sharp");
const router = express.Router();

const { DEFAULT_STYLE, VALID_TEMPLATES } = require("../config");
const { sanitizeColor, sanitizeFont, sanitizeLabel, dayjs } = require("../utils");
const { renderTemplate } = require("../templates");
const { buildCountdownSegments, getCacheKey, getFromCache, setInCache } = require("../services");
const { corsHeaders, handlePreflight } = require("../middleware");

/**
 * Parse timer request parameters
 * @param {Object} req - Express request
 * @returns {Object} Parsed parameters
 */
function parseTimerParams(req) {
  const labelParam = req.query.label;
  const label = labelParam !== undefined ? sanitizeLabel(labelParam, "") : DEFAULT_STYLE.label;
  const target = typeof req.query.target === "string" ? req.query.target : null;
  const template =
    typeof req.query.template === "string" && VALID_TEMPLATES.includes(req.query.template)
      ? req.query.template
      : "boxed";
  const background = sanitizeColor(req.query.bg, DEFAULT_STYLE.background);
  const box = sanitizeColor(req.query.box, DEFAULT_STYLE.box);
  const digits = sanitizeColor(req.query.digits, DEFAULT_STYLE.digits);
  const labelsColor = sanitizeColor(req.query.labels, DEFAULT_STYLE.labels);
  const accent = sanitizeColor(req.query.accent, DEFAULT_STYLE.accent);
  const font = sanitizeFont(req.query.font, DEFAULT_STYLE.font);

  // New parameters: radius and labelStyle
  const radiusParam = parseInt(req.query.radius, 10);
  const radius = !isNaN(radiusParam) && radiusParam >= 0 && radiusParam <= 50 ? radiusParam : 16;
  const labelStyle = req.query.labelStyle === "short" ? "short" : "long";

  return { label, target, template, background, box, digits, labelsColor, accent, font, radius, labelStyle };
}

/**
 * Calculate countdown segments from target
 * @param {string|null} target - Target ISO date string
 * @param {string} labelStyle - 'short' or 'long'
 * @returns {Array} Countdown segments
 */
function calculateSegments(target, labelStyle = "long") {
  const now = dayjs();
  const targetDate = target ? dayjs(target) : null;
  let diffSeconds = 0;
  if (targetDate && targetDate.isValid()) {
    const diff = targetDate.diff(now, "second");
    diffSeconds = Math.max(diff, 0);
  }
  return buildCountdownSegments(diffSeconds, labelStyle);
}

// SVG Routes
router.options("/timer.svg", handlePreflight);

router.get("/timer.svg", corsHeaders, (req, res) => {
  const params = parseTimerParams(req);
  const segments = calculateSegments(params.target, params.labelStyle);
  const colors = {
    background: params.background,
    box: params.box,
    digits: params.digits,
    labelsColor: params.labelsColor,
    accent: params.accent,
  };
  const options = { radius: params.radius };

  const svg = renderTemplate(params.template, segments, params.label, colors, params.font, options);

  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=0, must-revalidate");
  res.send(svg);
});

// PNG Routes
router.options("/timer.png", handlePreflight);

router.get("/timer.png", corsHeaders, async (req, res) => {
  try {
    // Check cache first
    const cacheKey = getCacheKey(req);
    const cachedBuffer = getFromCache(cacheKey);

    if (cachedBuffer) {
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "public, max-age=5, must-revalidate");
      res.set("X-Cache", "HIT");
      return res.send(cachedBuffer);
    }

    // Cache miss - generate new PNG
    const params = parseTimerParams(req);
    const segments = calculateSegments(params.target, params.labelStyle);
    const colors = {
      background: params.background,
      box: params.box,
      digits: params.digits,
      labelsColor: params.labelsColor,
      accent: params.accent,
    };
    const options = { radius: params.radius };

    const svg = renderTemplate(params.template, segments, params.label, colors, params.font, options);

    // Convert SVG to PNG using Sharp with optimized settings
    const pngBuffer = await sharp(Buffer.from(svg), { density: 150 })
      .png({
        compressionLevel: 6,
        adaptiveFiltering: true,
        palette: true,
      })
      .toBuffer();

    // Store in cache
    setInCache(cacheKey, pngBuffer);

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=5, must-revalidate");
    res.set("X-Cache", "MISS");
    res.send(pngBuffer);
  } catch (error) {
    console.error("Error generating PNG:", error);
    res.status(500).send("Error generating countdown image");
  }
});

module.exports = router;
