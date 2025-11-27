const express = require('express');
const sharp = require('sharp');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const duration = require('dayjs/plugin/duration');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Simple in-memory cache for PNG images (5 second TTL)
const pngCache = new Map();
const CACHE_TTL = 5000; // 5 seconds

function getCacheKey(req) {
  const params = new URLSearchParams(req.query);
  params.sort();
  return params.toString();
}

function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of pngCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      pngCache.delete(key);
    }
  }
}

// Cleanup cache every 5 seconds
setInterval(cleanupCache, 5000);

const DEFAULT_STYLE = {
  label: 'Offer Ends In',
  timezone: 'UTC',
  background: '#1c1917',
  box: '#292524',
  digits: '#facc15',
  labels: '#a8a29e',
  accent: '#facc15',
  font: "TikTok Sans, 'Outfit', sans-serif",
};

const FALLBACK_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Amsterdam',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const TIMEZONES = (() => {
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try {
      return Intl.supportedValuesOf('timeZone').sort((a, b) => a.localeCompare(b));
    } catch (error) {
      return FALLBACK_TIMEZONES;
    }
  }
  return FALLBACK_TIMEZONES;
})();

function sanitizeColor(input, fallback) {
  if (typeof input !== 'string') return fallback;
  let value = input.trim();
  if (!value) return fallback;
  if (!value.startsWith('#')) {
    value = `#${value}`;
  }
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
    return value;
  }
  return fallback;
}

function sanitizeFont(input, fallback) {
  if (typeof input !== 'string') return fallback;
  const cleaned = input.replace(/[^a-zA-Z0-9,\-\s]/g, '').trim();
  return cleaned || fallback;
}

function sanitizeLabel(input, fallback) {
  if (typeof input !== 'string') return fallback;
  const trimmed = input.trim();
  // Allow empty string if explicitly provided, only use fallback if undefined/null
  if (trimmed === '' && input !== undefined) return '';
  return trimmed ? trimmed.slice(0, 60) : fallback;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateTimeLocal(date, zone) {
  return dayjs(date).tz(zone).format('YYYY-MM-DDTHH:mm');
}

function buildSnippet(imageUrl, label) {
  const escapedLabel = escapeHtml(label);
  return `<img src="${imageUrl}" alt="${escapedLabel}" width="600" style="display:block;max-width:100%;height:auto;border:0;">`;
}

function renderPage(data) {
  const labelValue = escapeHtml(data.label);
  const backgroundValue = escapeHtml(data.background);
  const boxValue = escapeHtml(data.box);
  const digitsValue = escapeHtml(data.digits);
  const labelsValue = escapeHtml(data.labels);
  const accentValue = escapeHtml(data.accent);
  const fontValue = escapeHtml(data.font);
  const previewUrl = escapeHtml(data.previewUrl);
  const snippetValue = escapeHtml(data.snippet);
  const formDateValue = escapeHtml(data.formDate);

  const timezoneOptions = data.timezones
    .map((tz) => `<option value="${tz}" ${tz === data.timezone ? 'selected' : ''}>${tz}</option>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Countdown Builder</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/tiktok-sans" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css"/>
  <style>
    :root {
      --bg-color: #1c1917;
      --card-bg: #292524;
      --text-main: #e7e5e4;
      --text-muted: #a8a29e;
      --accent-color: #facc15;
      --accent-hover: #eab308;
      --border-color: #44403c;
      --input-bg: #0c0a09;
      --font-main: "TikTok Sans", "Outfit", sans-serif;
    }

    * { box-sizing: border-box; }

    body {
      font-family: var(--font-main);
      margin: 0;
      background: var(--bg-color);
      color: var(--text-main);
      min-height: 100vh;
      background-image: radial-gradient(circle at top center, #451a03 0%, var(--bg-color) 40%);
    }

    header {
      padding: 4rem 1rem 3rem;
      text-align: center;
      animation: fadeInDown 0.8s ease-out;
    }

    header h1 {
      margin: 0;
      font-size: clamp(2.5rem, 6vw, 3.5rem);
      font-weight: 700;
      background: linear-gradient(to right, #facc15, #fb923c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    header p {
      margin-top: 1rem;
      color: var(--text-muted);
      font-size: 1.1rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem 4rem;
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      animation: fadeInUp 0.8s ease-out 0.2s backwards;
    }

    section {
      background: rgba(41, 37, 36, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(250, 204, 21, 0.1);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    section:hover {
      transform: translateY(-2px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      border-color: rgba(250, 204, 21, 0.2);
    }

    section h2 {
      margin-top: 0;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    section h2::before {
      content: '';
      display: block;
      width: 4px;
      height: 24px;
      background: var(--accent-color);
      border-radius: 2px;
    }

    form {
      display: grid;
      gap: 1.25rem;
    }

    label {
      font-size: 0.9rem;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);
      padding: 0.85rem 1rem;
      background: var(--input-bg);
      color: var(--text-main);
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.15);
    }

    .color-input-wrapper {
      display: flex;
      gap: 0.75rem;
      align-items: stretch;
    }

    .color-text {
      flex: 1;
      font-family: 'Monaco', 'Courier New', monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .color-picker {
      width: 46px;
      height: 46px;
      flex-shrink: 0;
    }

    .pickr {
      width: 100% !important;
      height: 100%;
    }

    .pickr .pcr-button {
      width: 100%;
      height: 100%;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);
    }

    .pickr .pcr-button::after {
      border-radius: 0.75rem;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }

    button {
      border: none;
      border-radius: 0.75rem;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--accent-color);
      color: #1c1917;
      width: 100%;
      margin-top: 0.5rem;
      font-family: var(--font-main);
    }

    button:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
    }

    button:active {
      transform: translateY(0);
    }

    textarea {
      width: 100%;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);
      padding: 1rem;
      background: var(--input-bg);
      color: var(--text-main);
      font-size: 0.9rem;
      font-family: 'Monaco', 'Courier New', monospace;
      min-height: 120px;
      resize: vertical;
      line-height: 1.5;
    }

    textarea:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    .preview img {
      width: 100%;
      border-radius: 1rem;
      border: 1px solid var(--border-color);
      background: #000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .snippet-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;
    }

    .snippet-actions button {
      width: auto;
      margin-top: 0;
    }

    small {
      color: var(--text-muted);
      font-size: 0.85rem;
      display: block;
      margin-top: 0.5rem;
    }

    footer {
      text-align: center;
      padding: 2rem 1rem 3rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      border-top: 1px solid var(--border-color);
      margin-top: 2rem;
      background: rgba(28, 25, 23, 0.5);
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    footer a:hover {
      color: var(--accent-hover);
      text-decoration: underline;
    }

    /* Animations */
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Pickr theme customization */
    .pcr-app {
      background: #292524 !important;
      border: 1px solid #44403c !important;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5) !important;
      border-radius: 1rem !important;
    }
    .pcr-app .pcr-interaction input {
      background: #0c0a09 !important;
      color: #e7e5e4 !important;
      border: 1px solid #44403c !important;
      border-radius: 0.5rem !important;
    }
    .pcr-app .pcr-interaction .pcr-result {
      background: #0c0a09 !important;
      color: #e7e5e4 !important;
      border: 1px solid #44403c !important;
      border-radius: 0.5rem !important;
    }
    .pcr-app .pcr-interaction .pcr-save {
      background: #facc15 !important;
      color: #1c1917 !important;
      border-radius: 0.5rem !important;
    }
    .pcr-app .pcr-interaction .pcr-save:hover {
      background: #eab308 !important;
    }
  </style>
</head>
<body>
  <header>
    <h1>Email Countdown Builder</h1>
    <p>Generate hosted countdown timers you can drop straight into any Klaviyo or ESP email template.</p>
  </header>
  <main>
    <section>
      <h2>Configure your timer</h2>
      <form method="GET" action="">
        <div>
          <label for="label">Headline</label>
          <input type="text" id="label" name="label" value="${labelValue}" placeholder="Offer Ends In">
        </div>
        <div>
          <label for="timezone">Timezone</label>
          <select id="timezone" name="timezone">${timezoneOptions}</select>
        </div>
        <div>
          <label for="date">Target date & time</label>
          <input type="datetime-local" id="date" name="date" value="${formDateValue}" required>
        </div>
        <div>
          <label for="template">Template Style</label>
          <select id="template" name="template">
            <option value="boxed" ${data.template === 'boxed' ? 'selected' : ''}>Boxed (Modern)</option>
            <option value="minimal" ${data.template === 'minimal' ? 'selected' : ''}>Minimal (Clean)</option>
            <option value="minimal-narrow" ${data.template === 'minimal-narrow' ? 'selected' : ''}>Minimal Narrow (Compact)</option>
          </select>
        </div>
        <div class="color-grid">
          <div>
            <label for="bg">Page background</label>
            <div class="color-input-wrapper">
              <input type="text" id="bg" name="bg" value="${backgroundValue}" class="color-text" maxlength="7" placeholder="#1c1917">
              <div id="bg-picker" class="color-picker"></div>
            </div>
          </div>
          <div>
            <label for="box">Timer boxes</label>
            <div class="color-input-wrapper">
              <input type="text" id="box" name="box" value="${boxValue}" class="color-text" maxlength="7" placeholder="#292524">
              <div id="box-picker" class="color-picker"></div>
            </div>
          </div>
          <div>
            <label for="digits">Digits</label>
            <div class="color-input-wrapper">
              <input type="text" id="digits" name="digits" value="${digitsValue}" class="color-text" maxlength="7" placeholder="#facc15">
              <div id="digits-picker" class="color-picker"></div>
            </div>
          </div>
          <div>
            <label for="labels">Labels</label>
            <div class="color-input-wrapper">
              <input type="text" id="labels" name="labels" value="${labelsValue}" class="color-text" maxlength="7" placeholder="#a8a29e">
              <div id="labels-picker" class="color-picker"></div>
            </div>
          </div>
          <div>
            <label for="accent">Accent</label>
            <div class="color-input-wrapper">
              <input type="text" id="accent" name="accent" value="${accentValue}" class="color-text" maxlength="7" placeholder="#facc15">
              <div id="accent-picker" class="color-picker"></div>
            </div>
          </div>
        </div>
        <div>
          <label for="font">Font stack</label>
          <input type="text" id="font" name="font" value="${fontValue}">
          <small>Use web-safe font stacks for best rendering inside email clients.</small>
        </div>
        <button type="submit">Generate snippet</button>
      </form>
    </section>
    <section class="preview">
      <h2>Preview</h2>
      <img src="${previewUrl}" alt="Countdown preview">
      <p><small>This countdown image is generated on the fly each time an email is opened.</small></p>
    </section>
    <section>
      <h2>Paste into Klaviyo</h2>
      <textarea readonly id="snippet">${snippetValue}</textarea>
      <div class="snippet-actions">
        <button type="button" id="copyBtn">Copy snippet</button>
        <span id="copyState" style="color: var(--accent-color); font-weight: 600;"></span>
      </div>
      <p><small>Drop the snippet into an HTML block in Klaviyo. The timer will keep counting down until the target moment.</small></p>
    </section>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
  <script>
    // Copy button functionality
    const copyBtn = document.getElementById('copyBtn');
    const snippet = document.getElementById('snippet');
    const copyState = document.getElementById('copyState');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(snippet.value.trim());
        copyState.textContent = 'Copied!';
        setTimeout(() => copyState.textContent = '', 2000);
      } catch (error) {
        snippet.select();
        document.execCommand('copy');
        copyState.textContent = 'Copied using fallback';
        setTimeout(() => copyState.textContent = '', 2000);
      }
    });

    // Initialize Pickr color pickers
    const colorFields = ['bg', 'box', 'digits', 'labels', 'accent'];
    const pickers = {};

    colorFields.forEach(field => {
      const textInput = document.getElementById(field);
      const pickerEl = document.getElementById(field + '-picker');

      if (textInput && pickerEl) {
        // Initialize Pickr
        const pickr = Pickr.create({
          el: pickerEl,
          theme: 'nano',
          default: textInput.value || '#000000',
          swatches: [
            '#1c1917', '#292524', '#facc15', '#a8a29e', '#e7e5e4',
            '#000000', '#ffffff', '#ef4444', '#f59e0b', '#10b981',
            '#3b82f6', '#8b5cf6', '#ec4899'
          ],
          components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
              hex: true,
              input: true,
              save: true
            }
          }
        });

        pickers[field] = pickr;

        // When Pickr color changes, update text input
        pickr.on('change', (color) => {
          const hexColor = color.toHEXA().toString().toUpperCase();
          textInput.value = hexColor;
        });

        pickr.on('save', (color) => {
          if (color) {
            const hexColor = color.toHEXA().toString().toUpperCase();
            textInput.value = hexColor;
          }
          pickr.hide();
        });

        // When text input changes, update Pickr if valid hex
        textInput.addEventListener('input', (e) => {
          let value = e.target.value.trim();
          // Ensure it starts with #
          if (value && !value.startsWith('#')) {
            value = '#' + value;
            textInput.value = value;
          }
          // If valid hex color, update picker
          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            pickr.setColor(value);
          }
        });
      }
    });
  </script>
  <footer>
    Made with ❤️ and ☕ by <a href="https://sim-lab.eu" target="_blank">Sim-Lab</a> © 2025
  </footer>
</body>
</html>`;
}

function buildTimerParameters(req) {
  const timezone = typeof req.query.timezone === 'string' && TIMEZONES.includes(req.query.timezone)
    ? req.query.timezone
    : DEFAULT_STYLE.timezone;

  const label = sanitizeLabel(req.query.label, DEFAULT_STYLE.label);

  const validTemplates = ['boxed', 'minimal', 'minimal-narrow'];
  const template = typeof req.query.template === 'string' && validTemplates.includes(req.query.template)
    ? req.query.template
    : 'boxed';

  const background = sanitizeColor(req.query.bg, DEFAULT_STYLE.background);
  const box = sanitizeColor(req.query.box, DEFAULT_STYLE.box);
  const digits = sanitizeColor(req.query.digits, DEFAULT_STYLE.digits);
  const labels = sanitizeColor(req.query.labels, DEFAULT_STYLE.labels);
  const accent = sanitizeColor(req.query.accent, DEFAULT_STYLE.accent);
  const font = sanitizeFont(req.query.font, DEFAULT_STYLE.font);

  const requestedDate = typeof req.query.date === 'string' ? req.query.date : null;
  let targetMoment;
  if (requestedDate) {
    targetMoment = dayjs.tz(requestedDate, 'YYYY-MM-DDTHH:mm', timezone);
  }
  if (!targetMoment || !targetMoment.isValid()) {
    targetMoment = dayjs().tz(timezone).add(2, 'day').minute(0).second(0);
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

app.get('/', (req, res) => {
  const params = buildTimerParameters(req);
  const basePath = req.get('x-base-path') || '';
  const baseUrl = `${req.protocol}://${req.get('host')}${basePath}`;
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

function buildCountdownSegments(diffSeconds) {
  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return [
    { label: 'Days', value: days.toString().padStart(2, '0') },
    { label: 'Hours', value: hours.toString().padStart(2, '0') },
    { label: 'Minutes', value: minutes.toString().padStart(2, '0') },
    { label: 'Seconds', value: seconds.toString().padStart(2, '0') },
  ];
}

function renderBoxedTemplate(segments, label, colors, font) {
  const { background, box, digits, labelsColor, accent } = colors;
  const gap = 18;
  const boxWidth = 150;
  const boxHeight = 110;
  const svgWidth = gap + segments.length * (boxWidth + gap);
  const hasLabel = label && label.trim().length > 0;
  const svgHeight = hasLabel ? 220 : 160;
  const boxesY = hasLabel ? 75 : 20;
  let cursorX = gap;

  const boxes = segments
    .map((segment) => {
      const block = `<g transform="translate(${cursorX},${boxesY})">
        <rect rx="16" ry="16" width="${boxWidth}" height="${boxHeight}" fill="${box}"></rect>
        <text x="${boxWidth / 2}" y="60" text-anchor="middle" font-size="42" font-weight="700" fill="${digits}" font-family="${font}">${segment.value}</text>
        <text x="${boxWidth / 2}" y="95" text-anchor="middle" font-size="16" letter-spacing="0.2em" fill="${labelsColor}" font-family="${font}" opacity="0.9">${segment.label.toUpperCase()}</text>
      </g>`;
      cursorX += boxWidth + gap;
      return block;
    })
    .join('');

  const headerSection = hasLabel ? `<text x="${svgWidth / 2}" y="48" text-anchor="middle" font-size="26" font-weight="600" fill="${accent}" font-family="${font}">${escapeHtml(label)}</text>
  <line x1="${svgWidth / 2 - 80}" x2="${svgWidth / 2 + 80}" y1="60" y2="60" stroke="${accent}" stroke-width="2" stroke-linecap="round" opacity="0.4" />` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="${box}" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${background}" rx="28" ry="28" />
  ${headerSection}
  <g filter="url(#shadow)">${boxes}</g>
</svg>`;
}

function renderMinimalTemplate(segments, label, colors, font) {
  const { background, digits, labelsColor, accent } = colors;
  const segmentWidth = 110;
  const separatorWidth = 30;
  const svgWidth = 60 + segments.length * segmentWidth + (segments.length - 1) * separatorWidth;
  const hasLabel = label && label.trim().length > 0;
  const svgHeight = hasLabel ? 180 : 140;
  const itemsY = hasLabel ? 60 : 30;
  let cursorX = 30;

  const items = [];
  segments.forEach((segment, index) => {
    items.push(`<g transform="translate(${cursorX},${itemsY})">
      <text x="${segmentWidth / 2}" y="50" text-anchor="middle" font-size="52" font-weight="700" fill="${digits}" font-family="${font}">${segment.value}</text>
      <text x="${segmentWidth / 2}" y="85" text-anchor="middle" font-size="14" letter-spacing="0.1em" fill="${labelsColor}" font-family="${font}" opacity="0.8">${segment.label.toUpperCase()}</text>
    </g>`);

    cursorX += segmentWidth;
    if (index < segments.length - 1) {
      const separatorY = itemsY + 50;
      items.push(`<text x="${cursorX + separatorWidth / 2}" y="${separatorY}" text-anchor="middle" font-size="36" font-weight="300" fill="${accent}" font-family="${font}" opacity="0.5">:</text>`);
      cursorX += separatorWidth;
    }
  });

  const headerSection = hasLabel ? `<text x="${svgWidth / 2}" y="35" text-anchor="middle" font-size="22" font-weight="600" fill="${accent}" font-family="${font}">${escapeHtml(label)}</text>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${background}" rx="24" ry="24" />
  ${headerSection}
  ${items.join('\n  ')}
</svg>`;
}

function renderMinimalNarrowTemplate(segments, label, colors, font) {
  const { background, digits, labelsColor, accent } = colors;
  const segmentWidth = 75;
  const separatorWidth = 20;
  const svgWidth = 40 + segments.length * segmentWidth + (segments.length - 1) * separatorWidth;
  const hasLabel = label && label.trim().length > 0;
  const svgHeight = hasLabel ? 180 : 140;
  const itemsY = hasLabel ? 60 : 30;
  let cursorX = 20;

  const items = [];
  segments.forEach((segment, index) => {
    items.push(`<g transform="translate(${cursorX},${itemsY})">
      <text x="${segmentWidth / 2}" y="50" text-anchor="middle" font-size="52" font-weight="700" fill="${digits}" font-family="${font}">${segment.value}</text>
      <text x="${segmentWidth / 2}" y="85" text-anchor="middle" font-size="14" letter-spacing="0.1em" fill="${labelsColor}" font-family="${font}" opacity="0.8">${segment.label.toUpperCase()}</text>
    </g>`);

    cursorX += segmentWidth;
    if (index < segments.length - 1) {
      const separatorY = itemsY + 50;
      items.push(`<text x="${cursorX + separatorWidth / 2}" y="${separatorY}" text-anchor="middle" font-size="36" font-weight="300" fill="${accent}" font-family="${font}" opacity="0.5">:</text>`);
      cursorX += separatorWidth;
    }
  });

  const headerSection = hasLabel ? `<text x="${svgWidth / 2}" y="35" text-anchor="middle" font-size="22" font-weight="600" fill="${accent}" font-family="${font}">${escapeHtml(label)}</text>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${background}" rx="24" ry="24" />
  ${headerSection}
  ${items.join('\n  ')}
</svg>`;
}

app.options('/timer.svg', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

app.get('/timer.svg', (req, res) => {
  // Allow empty label if query param exists but is empty
  const labelParam = req.query.label;
  const label = labelParam !== undefined ? sanitizeLabel(labelParam, '') : DEFAULT_STYLE.label;
  const target = typeof req.query.target === 'string' ? req.query.target : null;
  const validTemplates = ['boxed', 'minimal', 'minimal-narrow'];
  const template = typeof req.query.template === 'string' && validTemplates.includes(req.query.template)
    ? req.query.template
    : 'boxed';
  const background = sanitizeColor(req.query.bg, DEFAULT_STYLE.background);
  const box = sanitizeColor(req.query.box, DEFAULT_STYLE.box);
  const digits = sanitizeColor(req.query.digits, DEFAULT_STYLE.digits);
  const labelsColor = sanitizeColor(req.query.labels, DEFAULT_STYLE.labels);
  const accent = sanitizeColor(req.query.accent, DEFAULT_STYLE.accent);
  const font = sanitizeFont(req.query.font, DEFAULT_STYLE.font);

  const now = dayjs();
  const targetDate = target ? dayjs(target) : null;
  let diffSeconds = 0;
  if (targetDate && targetDate.isValid()) {
    const diff = targetDate.diff(now, 'second');
    diffSeconds = Math.max(diff, 0);
  }

  const segments = buildCountdownSegments(diffSeconds);
  const colors = { background, box, digits, labelsColor, accent };

  let svg;
  switch (template) {
    case 'minimal':
      svg = renderMinimalTemplate(segments, label, colors, font);
      break;
    case 'minimal-narrow':
      svg = renderMinimalNarrowTemplate(segments, label, colors, font);
      break;
    case 'boxed':
    default:
      svg = renderBoxedTemplate(segments, label, colors, font);
      break;
  }

  res.set('Content-Type', 'image/svg+xml');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Cache-Control', 'public, max-age=0, must-revalidate');
  res.send(svg);
});

app.options('/timer.png', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

app.get('/timer.png', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = getCacheKey(req);
    const cached = pngCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      // Cache hit - return cached PNG
      res.set('Content-Type', 'image/png');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Cache-Control', 'public, max-age=5, must-revalidate');
      res.set('X-Cache', 'HIT');
      return res.send(cached.buffer);
    }

    // Cache miss - generate new PNG
    // Allow empty label if query param exists but is empty
    const labelParam = req.query.label;
    const label = labelParam !== undefined ? sanitizeLabel(labelParam, '') : DEFAULT_STYLE.label;
    const target = typeof req.query.target === 'string' ? req.query.target : null;
    const validTemplates = ['boxed', 'minimal', 'minimal-narrow'];
    const template = typeof req.query.template === 'string' && validTemplates.includes(req.query.template)
      ? req.query.template
      : 'boxed';
    const background = sanitizeColor(req.query.bg, DEFAULT_STYLE.background);
    const box = sanitizeColor(req.query.box, DEFAULT_STYLE.box);
    const digits = sanitizeColor(req.query.digits, DEFAULT_STYLE.digits);
    const labelsColor = sanitizeColor(req.query.labels, DEFAULT_STYLE.labels);
    const accent = sanitizeColor(req.query.accent, DEFAULT_STYLE.accent);
    const font = sanitizeFont(req.query.font, DEFAULT_STYLE.font);

    const nowTime = dayjs();
    const targetDate = target ? dayjs(target) : null;
    let diffSeconds = 0;
    if (targetDate && targetDate.isValid()) {
      const diff = targetDate.diff(nowTime, 'second');
      diffSeconds = Math.max(diff, 0);
    }

    const segments = buildCountdownSegments(diffSeconds);
    const colors = { background, box, digits, labelsColor, accent };

    let svg;
    switch (template) {
      case 'minimal':
        svg = renderMinimalTemplate(segments, label, colors, font);
        break;
      case 'minimal-narrow':
        svg = renderMinimalNarrowTemplate(segments, label, colors, font);
        break;
      case 'boxed':
      default:
        svg = renderBoxedTemplate(segments, label, colors, font);
        break;
    }

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    // Store in cache
    pngCache.set(cacheKey, {
      buffer: pngBuffer,
      timestamp: now
    });

    res.set('Content-Type', 'image/png');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cache-Control', 'public, max-age=5, must-revalidate');
    res.set('X-Cache', 'MISS');
    res.send(pngBuffer);
  } catch (error) {
    console.error('Error generating PNG:', error);
    res.status(500).send('Error generating countdown image');
  }
});

const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`Countdown builder ready on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error(`Unable to start countdown builder: ${error.message}`);
});
