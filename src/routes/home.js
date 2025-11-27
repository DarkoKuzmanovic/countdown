/**
 * Home page route
 */

const express = require("express");
const router = express.Router();

const { DEFAULT_STYLE, TIMEZONES, VALID_TEMPLATES } = require("../config");
const { sanitizeColor, sanitizeFont, sanitizeLabel, formatDateTimeLocal, buildSnippet, dayjs } = require("../utils");
const { renderPage } = require("../templates/page");

/**
 * Build timer parameters from request query
 * @param {Object} req - Express request
 * @returns {Object} Timer parameters
 */
function buildTimerParameters(req) {
  const timezone =
    typeof req.query.timezone === "string" && TIMEZONES.includes(req.query.timezone)
      ? req.query.timezone
      : DEFAULT_STYLE.timezone;

  const label = sanitizeLabel(req.query.label, DEFAULT_STYLE.label);

  const template =
    typeof req.query.template === "string" && VALID_TEMPLATES.includes(req.query.template)
      ? req.query.template
      : "boxed";

  const background = sanitizeColor(req.query.bg, DEFAULT_STYLE.background);
  const box = sanitizeColor(req.query.box, DEFAULT_STYLE.box);
  const digits = sanitizeColor(req.query.digits, DEFAULT_STYLE.digits);
  const labels = sanitizeColor(req.query.labels, DEFAULT_STYLE.labels);
  const accent = sanitizeColor(req.query.accent, DEFAULT_STYLE.accent);
  const font = sanitizeFont(req.query.font, DEFAULT_STYLE.font);

  const requestedDate = typeof req.query.date === "string" ? req.query.date : null;
  let targetMoment;
  if (requestedDate) {
    targetMoment = dayjs.tz(requestedDate, "YYYY-MM-DDTHH:mm", timezone);
  }
  if (!targetMoment || !targetMoment.isValid()) {
    targetMoment = dayjs().tz(timezone).add(2, "day").minute(0).second(0);
  }

  return {
    timezone,
    label,
    template,
    background,
    box,
    digits,
    labels,
    accent,
    font,
    targetMoment,
  };
}

router.get("/", (req, res) => {
  const params = buildTimerParameters(req);
  const basePath = req.get("x-base-path") || "";
  const baseUrl = `${req.protocol}://${req.get("host")}${basePath}`;
  const targetIso = params.targetMoment.utc().toISOString();

  const search = new URLSearchParams({
    target: targetIso,
    label: params.label,
    template: params.template,
    bg: params.background,
    box: params.box,
    digits: params.digits,
    labels: params.labels,
    accent: params.accent,
    font: params.font,
  });
  const imageUrlPng = `${baseUrl}/timer.png?${search.toString()}`;
  const imageUrlSvg = `${baseUrl}/timer.svg?${search.toString()}`;
  const previewUrl = `${imageUrlSvg}&_=${Date.now()}`;

  const html = renderPage({
    timezones: TIMEZONES,
    timezone: params.timezone,
    label: params.label,
    template: params.template,
    background: params.background,
    box: params.box,
    digits: params.digits,
    labels: params.labels,
    accent: params.accent,
    font: params.font,
    formDate: formatDateTimeLocal(params.targetMoment, params.timezone),
    snippet: buildSnippet(imageUrlPng, params.label),
    previewUrl,
  });

  res.send(html);
});

module.exports = router;
