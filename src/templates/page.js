/**
 * Main page HTML template
 */

const { escapeHtml } = require("../utils/html");

/**
 * Render the main page HTML
 * @param {Object} data - Page data
 * @returns {string} HTML string
 */
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
    .map((tz) => `<option value="${tz}" ${tz === data.timezone ? "selected" : ""}>${tz}</option>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Countdown Builder</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/tiktok-sans" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css"/>
  <style>
    :root {
      --bg-color: #0f0d0c;
      --card-bg: #1c1917;
      --card-bg-hover: #292524;
      --text-main: #e7e5e4;
      --text-muted: #a8a29e;
      --accent-color: #facc15;
      --accent-hover: #eab308;
      --border-color: #292524;
      --input-bg: #0c0a09;
      --font-main: "TikTok Sans", "Outfit", sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-main);
      background: var(--bg-color);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
    }

    /* ============ Header ============ */
    header {
      padding: 2rem 1rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      background: linear-gradient(180deg, #1a1512 0%, var(--bg-color) 100%);
    }

    header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(to right, #facc15, #fb923c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    header p {
      margin-top: 0.5rem;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    /* ============ Main Layout ============ */
    .app-container {
      display: grid;
      grid-template-columns: 400px 1fr;
      min-height: calc(100vh - 120px);
    }

    /* ============ Right Panel - Preview & Output ============ */
    .preview-panel {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      border-left: 1px solid var(--border-color);
      background: var(--bg-color);
    }

    .preview-section {
      flex: 0 0 auto;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .preview-header h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .preview-status {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .preview-status.updating {
      color: var(--accent-color);
    }

    .preview-container {
      position: relative;
      background: #000;
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .preview-container img {
      display: block;
      width: 100%;
      height: auto;
    }

    .preview-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
      padding: 0 0.25rem;
    }

    .preview-dimensions {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .live-countdown {
      font-size: 0.85rem;
      color: var(--accent-color);
      font-weight: 600;
      font-family: 'Monaco', 'Courier New', monospace;
      letter-spacing: 0.02em;
    }

    .live-countdown.expired {
      color: #ef4444;
    }

    .preview-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .preview-link {
      color: var(--accent-color);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .preview-link:hover {
      text-decoration: underline;
    }

    .icon-btn {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .icon-btn:hover {
      background: var(--card-bg-hover);
      color: var(--text-main);
      border-color: var(--accent-color);
    }

    /* ============ Embed Section ============ */
    .embed-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .embed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .embed-header h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .format-tabs {
      display: flex;
      gap: 0.25rem;
    }

    .format-tab {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .format-tab:hover {
      color: var(--text-main);
      background: var(--card-bg);
    }

    .format-tab.active {
      background: var(--accent-color);
      color: #000;
      font-weight: 600;
    }

    .embed-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      overflow: hidden;
      min-height: 120px;
    }

    .embed-box textarea {
      flex: 1;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--text-main);
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 0.85rem;
      padding: 1rem;
      resize: none;
      line-height: 1.6;
    }

    .embed-box textarea:focus {
      outline: none;
    }

    .embed-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border-color);
      background: rgba(0,0,0,0.2);
    }

    .copy-btn {
      background: var(--accent-color);
      border: none;
      color: #000;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .copy-btn:hover {
      background: var(--accent-hover);
    }

    .copy-state {
      color: var(--accent-color);
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* ============ Left Panel - Config ============ */
    .config-panel {
      background: var(--card-bg);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .config-section {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .config-section:last-child {
      border-bottom: none;
    }

    .config-section h3 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1rem;
    }

    .config-grid {
      display: grid;
      gap: 0.875rem;
    }

    .config-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.875rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .field label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .field input, .field select {
      width: 100%;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 0.6rem 0.75rem;
      color: var(--text-main);
      font-size: 0.9rem;
      font-family: inherit;
      transition: all 0.15s;
    }

    .field input:focus, .field select:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.1);
    }

    .field small {
      font-size: 0.75rem;
      color: var(--text-muted);
      opacity: 0.8;
    }

    /* ============ Range Slider ============ */
    .field input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      padding: 0;
      border: none;
      cursor: pointer;
    }

    .field input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      background: var(--accent-color);
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.15s;
    }

    .field input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      background: var(--accent-color);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.15s;
    }

    .field input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }

    .field input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }

    .field input[type="range"]:focus {
      outline: none;
      box-shadow: none;
    }

    /* ============ Color Inputs - Fixed proportions ============ */
    .color-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-row input {
      flex: 1;
      font-family: 'Monaco', 'Courier New', monospace;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.03em;
    }

    .color-swatch {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      cursor: pointer;
    }

    .pickr {
      width: 36px !important;
      height: 36px !important;
    }

    .pickr .pcr-button {
      width: 36px !important;
      height: 36px !important;
      border-radius: 0.5rem !important;
      border: 1px solid var(--border-color) !important;
    }

    /* ============ Color Grid - Compact 2x3 ============ */
    .colors-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .colors-grid .field label {
      font-size: 0.75rem;
    }

    /* ============ Buttons ============ */
    .btn-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      flex: 1;
      background: var(--accent-color);
      border: none;
      color: #000;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .btn-secondary:hover {
      border-color: var(--accent-color);
      color: var(--text-main);
    }

    /* ============ Quick Duration Buttons ============ */
    .quick-durations {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .quick-btn {
      flex: 1;
      padding: 0.4rem 0.5rem;
      font-size: 0.7rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }

    .quick-btn:hover {
      border-color: var(--accent-color);
      color: var(--accent-color);
    }

    /* ============ Timezone Search ============ */
    .timezone-wrapper {
      position: relative;
    }

    .timezone-search {
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem 0.5rem 0 0;
      color: var(--text-main);
      font-size: 0.85rem;
      font-family: inherit;
    }

    .timezone-search:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    .timezone-wrapper select {
      border-radius: 0 0 0.5rem 0.5rem;
      border-top: none;
    }

    /* ============ Toast Notification ============ */
    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--card-bg);
      border: 1px solid var(--accent-color);
      color: var(--text-main);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .toast.success {
      border-color: #22c55e;
    }

    .toast.success::before {
      content: '✓ ';
      color: #22c55e;
    }

    /* ============ Keyboard Hints ============ */
    .keyboard-hint {
      font-size: 0.65rem;
      color: var(--text-muted);
      opacity: 0.7;
      margin-left: 0.5rem;
    }

    kbd {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 0.25rem;
      padding: 0.1rem 0.3rem;
      font-family: inherit;
      font-size: 0.65rem;
    }

    /* ============ Tooltips ============ */
    [data-tooltip] {
      position: relative;
    }

    [data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #000;
      color: #fff;
      padding: 0.4rem 0.6rem;
      border-radius: 0.375rem;
      font-size: 0.7rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      z-index: 100;
      margin-bottom: 0.25rem;
    }

    [data-tooltip]:hover::after {
      opacity: 1;
      visibility: visible;
    }

    /* ============ ESP Tips ============ */
    .esp-tips {
      margin-top: 1rem;
      font-size: 0.8rem;
    }

    .esp-tips summary {
      cursor: pointer;
      color: var(--text-muted);
      padding: 0.5rem 0;
    }

    .esp-tips summary:hover {
      color: var(--text-main);
    }

    .esp-content {
      padding: 0.75rem 0;
      display: grid;
      gap: 0.5rem;
    }

    .esp-item {
      padding: 0.5rem 0.75rem;
      background: var(--input-bg);
      border-radius: 0.375rem;
    }

    .esp-item strong {
      color: var(--accent-color);
      font-size: 0.8rem;
    }

    .esp-item p {
      margin-top: 0.25rem;
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    /* ============ Loaders & States ============ */
    .preview-skeleton {
      background: linear-gradient(90deg, #1c1917 25%, #292524 50%, #1c1917 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      aspect-ratio: 16/9;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .preview-loader {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 2px solid var(--border-color);
      border-top-color: var(--accent-color);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .preview-error-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .preview-error-overlay .error-icon { font-size: 2rem; }
    .preview-error-overlay .error-text { color: #fca5a5; font-size: 0.9rem; }

    /* ============ Validation ============ */
    .input-wrapper { position: relative; }

    .validation-message {
      position: absolute;
      top: 100%;
      left: 0;
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      margin-top: 0.2rem;
      z-index: 10;
    }

    .validation-message.error { background: #dc2626; color: white; }
    .validation-message.warning { background: #d97706; color: white; }

    input.invalid { border-color: #dc2626 !important; }
    input.warning { border-color: #d97706 !important; }

    /* ============ Connection Status ============ */
    .connection-status {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      padding: 0.4rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 0.4rem;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 100;
    }

    .connection-status.visible { opacity: 1; }
    .connection-status.offline { background: #7f1d1d; border-color: #dc2626; }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
    }

    .connection-status.offline .status-dot { background: #dc2626; }

    /* ============ Footer ============ */
    footer {
      padding: 2rem 1.5rem;
      background: var(--card-bg);
      border-top: 1px solid var(--border-color);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .footer-section {
      font-size: 0.85rem;
    }

    .footer-section strong {
      display: block;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .footer-section p {
      color: var(--text-muted);
      margin: 0;
      line-height: 1.4;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .footer-section li {
      margin: 0;
    }

    .footer-section a {
      color: var(--accent-color);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-section a:hover {
      text-decoration: underline;
      color: var(--accent-color);
      opacity: 0.8;
    }

    .param-hint {
      color: var(--text-muted);
      font-family: monospace;
      font-size: 0.8rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
    }

    .footer-bottom {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      grid-column: 1 / -1;
    }

    .footer-bottom a {
      color: var(--accent-color);
      text-decoration: none;
    }

    .footer-bottom a:hover {
      text-decoration: underline;
    }

    .version-info {
      color: var(--text-muted);
    }

    /* ============ Responsive ============ */
    @media (max-width: 900px) {
      .app-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .preview-panel {
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        padding: 1.5rem;
      }

      .config-panel {
        max-height: none;
      }
    }

    @media (max-width: 600px) {
      header { padding: 1.5rem 1rem; }
      header h1 { font-size: 1.5rem; }

      .preview-panel { padding: 1rem; }

      .config-row { grid-template-columns: 1fr; }

      .colors-grid { grid-template-columns: 1fr; }

      .preview-meta { flex-direction: column; gap: 0.5rem; align-items: flex-start; }

      .footer-content { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem; }
    }

    /* ============ Pickr Overrides ============ */
    .pcr-app {
      background: #292524 !important;
      border: 1px solid #44403c !important;
      border-radius: 0.75rem !important;
    }

    .pcr-app .pcr-interaction input {
      background: #0c0a09 !important;
      color: #e7e5e4 !important;
      border: 1px solid #44403c !important;
      border-radius: 0.375rem !important;
    }

    .pcr-app .pcr-interaction .pcr-save {
      background: #facc15 !important;
      color: #000 !important;
      border-radius: 0.375rem !important;
    }

    /* ============ Animations ============ */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .app-container { animation: fadeIn 0.3s ease-out; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Email Countdown Builder</h1>
    <p>Generate hosted countdown timers for any email platform</p>
  </header>

  <form method="GET" action="" id="configForm">
  <div class="app-container">
    <!-- Left Panel: Configuration -->
    <div class="config-panel">
      <div class="config-section">
        <h3>Timer Settings</h3>
        <div class="config-grid">
          <div class="field">
            <label for="label">Headline</label>
            <input type="text" id="label" name="label" value="${labelValue}" placeholder="Offer Ends In" data-tooltip="Text shown above the countdown">
          </div>
          <div class="config-row">
            <div class="field">
              <label for="date">End Date & Time</label>
              <input type="datetime-local" id="date" name="date" value="${formDateValue}" required data-tooltip="When the countdown ends">
              <div class="quick-durations">
                <button type="button" class="quick-btn" data-duration="1">+1h</button>
                <button type="button" class="quick-btn" data-duration="24">+24h</button>
                <button type="button" class="quick-btn" data-duration="48">+48h</button>
                <button type="button" class="quick-btn" data-duration="168">+1 week</button>
              </div>
              <div id="dateValidation" class="validation-message" style="display:none;"></div>
            </div>
            <div class="field">
              <label for="timezoneSearch">Timezone</label>
              <div class="timezone-wrapper">
                <input type="text" id="timezoneSearch" class="timezone-search" placeholder="Search timezones..." data-tooltip="Filter timezone list">
                <select id="timezone" name="timezone">${timezoneOptions}</select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Style</h3>
        <div class="config-grid">
          <div class="config-row">
            <div class="field">
              <label for="template">Template</label>
              <select id="template" name="template" data-tooltip="Timer visual style">
                <option value="boxed" ${data.template === "boxed" ? "selected" : ""}>Boxed</option>
                <option value="minimal" ${data.template === "minimal" ? "selected" : ""}>Minimal</option>
                <option value="minimal-narrow" ${data.template === "minimal-narrow" ? "selected" : ""}>Compact</option>
              </select>
            </div>
            <div class="field">
              <label for="theme">Theme Preset</label>
              <select id="theme">
                <option value="">Custom</option>
                <option value="midnight-black">Midnight Black</option>
                <option value="dark-gold">Dark Gold</option>
                <option value="midnight-blue">Midnight Blue</option>
                <option value="forest-green">Forest Green</option>
                <option value="sunset-orange">Sunset Orange</option>
                <option value="royal-purple">Royal Purple</option>
                <option value="light-minimal">Light Minimal</option>
                <option value="neon-pink">Neon Pink</option>
                <option value="ocean-teal">Ocean Teal</option>
              </select>
            </div>
          </div>
          <div class="config-row">
            <div class="field">
              <label for="radius">Corner Radius: <span id="radius-value">16</span>px</label>
              <input type="range" id="radius" name="radius" min="0" max="50" value="16" data-tooltip="Roundness of timer corners">
            </div>
            <div class="field">
              <label for="labelStyle">Unit Labels</label>
              <select id="labelStyle" name="labelStyle" data-tooltip="Label format for time units">
                <option value="long">Long (Days, Hours...)</option>
                <option value="short">Short (D, H, M, S)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Colors</h3>
        <div class="colors-grid">
          <div class="field">
            <label for="bg">Background</label>
            <div class="color-row">
              <input type="text" id="bg" name="bg" value="${backgroundValue}" maxlength="7" placeholder="#1c1917">
              <div id="bg-picker" class="color-swatch"></div>
            </div>
          </div>
          <div class="field">
            <label for="box">Timer Boxes</label>
            <div class="color-row">
              <input type="text" id="box" name="box" value="${boxValue}" maxlength="7" placeholder="#292524">
              <div id="box-picker" class="color-swatch"></div>
            </div>
          </div>
          <div class="field">
            <label for="digits">Digits</label>
            <div class="color-row">
              <input type="text" id="digits" name="digits" value="${digitsValue}" maxlength="7" placeholder="#facc15">
              <div id="digits-picker" class="color-swatch"></div>
            </div>
          </div>
          <div class="field">
            <label for="labels">Labels</label>
            <div class="color-row">
              <input type="text" id="labels" name="labels" value="${labelsValue}" maxlength="7" placeholder="#a8a29e">
              <div id="labels-picker" class="color-swatch"></div>
            </div>
          </div>
          <div class="field">
            <label for="accent">Accent</label>
            <div class="color-row">
              <input type="text" id="accent" name="accent" value="${accentValue}" maxlength="7" placeholder="#facc15">
              <div id="accent-picker" class="color-swatch"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Typography</h3>
        <div class="config-grid">
          <div class="config-row">
            <div class="field">
              <label for="font">Font Family</label>
              <select id="font" name="font" data-tooltip="Font for digits and labels">
                <option value="Arial, Helvetica, sans-serif" ${
                  fontValue.includes("Arial") ? "selected" : ""
                }>Arial</option>
                <option value="'Helvetica Neue', Helvetica, sans-serif" ${
                  fontValue.includes("Helvetica Neue") ? "selected" : ""
                }>Helvetica Neue</option>
                <option value="Georgia, 'Times New Roman', serif" ${
                  fontValue.includes("Georgia") ? "selected" : ""
                }>Georgia</option>
                <option value="'Trebuchet MS', sans-serif" ${
                  fontValue.includes("Trebuchet") ? "selected" : ""
                }>Trebuchet MS</option>
                <option value="Verdana, Geneva, sans-serif" ${
                  fontValue.includes("Verdana") ? "selected" : ""
                }>Verdana</option>
                <option value="'Courier New', monospace" ${
                  fontValue.includes("Courier") ? "selected" : ""
                }>Courier New</option>
                <option value="Impact, sans-serif" ${fontValue.includes("Impact") ? "selected" : ""}>Impact</option>
                <option value="'Lucida Console', Monaco, monospace" ${
                  fontValue.includes("Lucida") ? "selected" : ""
                }>Lucida Console</option>
                <option value="Tahoma, Geneva, sans-serif" ${
                  fontValue.includes("Tahoma") ? "selected" : ""
                }>Tahoma</option>
                <option value="TikTok Sans, 'Outfit', sans-serif" ${
                  fontValue.includes("TikTok") || fontValue === "TikTok Sans, 'Outfit', sans-serif" ? "selected" : ""
                }>TikTok Sans</option>
                <option value="'Inter', sans-serif" ${fontValue.includes("Inter") ? "selected" : ""}>Inter</option>
                <option value="'Arimo', sans-serif" ${fontValue.includes("Arimo") ? "selected" : ""}>Arimo</option>
              </select>
              <small>Web-safe fonts for email compatibility</small>
            </div>
            <div class="field">
              <label for="fontWeight">Font Weight</label>
              <select id="fontWeight" name="fontWeight" data-tooltip="Weight for digit numbers">
                <option value="100">Thin (100)</option>
                <option value="200">Extra Light (200)</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700" selected>Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Spacing</h3>
        <div class="config-grid">
          <div class="field">
            <label for="padding">Horizontal Padding: <span id="padding-value">20</span>px</label>
            <input type="range" id="padding" name="padding" min="0" max="150" value="20" data-tooltip="Left and right padding from edge">
          </div>
        </div>
      </div>

      <div class="config-section">
        <div class="btn-row">
          <button type="submit" class="btn-primary">Apply <span class="keyboard-hint"><kbd>Ctrl</kbd>+<kbd>Enter</kbd></span></button>
          <button type="button" id="resetBtn" class="btn-secondary">Reset</button>
        </div>
      </div>
    </div>

    <!-- Right Panel: Preview & Embed -->
    <div class="preview-panel">
      <div class="preview-section">
        <div class="preview-header">
          <h2>Preview <span id="previewStatus" class="preview-status"></span></h2>
          <div class="preview-actions">
            <a href="${previewUrl}" target="_blank" id="openNewTabLink" class="preview-link">Open ↗</a>
            <button type="button" id="downloadSvgBtn" class="icon-btn">SVG</button>
            <button type="button" id="downloadPngBtn" class="icon-btn">PNG</button>
          </div>
        </div>
        <div id="previewContainer" class="preview-container">
          <div id="previewSkeleton" class="preview-skeleton" style="display:none;"></div>
          <img id="previewImg" src="${previewUrl}" alt="Countdown preview">
          <div id="previewLoader" class="preview-loader" style="display:none;">
            <div class="spinner"></div>
          </div>
          <div id="previewError" class="preview-error-overlay" style="display:none;">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Failed to load preview</span>
            <button type="button" id="retryBtn" class="icon-btn">Retry</button>
          </div>
        </div>
        <div class="preview-meta">
          <span id="previewDimensions" class="preview-dimensions"></span>
          <span id="liveCountdown" class="live-countdown"></span>
        </div>
      </div>

      <div class="embed-section">
        <div class="embed-header">
          <h2>Embed Code</h2>
          <div class="format-tabs">
            <button type="button" class="format-tab active" data-format="html">HTML</button>
            <button type="button" class="format-tab" data-format="markdown">MD</button>
            <button type="button" class="format-tab" data-format="url">URL</button>
          </div>
        </div>
        <div class="embed-box">
          <textarea readonly id="snippet">${snippetValue}</textarea>
          <div class="embed-footer">
            <button type="button" id="copyBtn" class="copy-btn">Copy <span class="keyboard-hint"><kbd>Ctrl</kbd>+<kbd>C</kbd></span></button>
            <span id="copyState" class="copy-state"></span>
          </div>
        </div>
        <details class="esp-tips">
          <summary>📧 Platform tips</summary>
          <div class="esp-content">
            <div class="esp-item"><strong>Klaviyo</strong><p>Use an HTML block</p></div>
            <div class="esp-item"><strong>Mailchimp</strong><p>Use a Code block</p></div>
            <div class="esp-item"><strong>Omnisend</strong><p>Custom HTML block</p></div>
            <div class="esp-item"><strong>HubSpot</strong><p>Insert → Embed code</p></div>
          </div>
        </details>
      </div>
    </div>
  </div>
  </form>

  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <strong>Email Countdown Builder</strong>
        <p>Self-hosted countdown timer generator for email campaigns</p>
      </div>
      <div class="footer-section">
        <strong>Quick Links</strong>
        <ul>
          <li><a href="https://github.com/sim-lab/countdown" target="_blank">GitHub</a></li>
          <li><a href="/health" target="_blank">Health Check</a></li>
          <li><a href="https://sim-lab.eu" target="_blank">Sim-Lab</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <strong>API Reference</strong>
        <ul>
          <li><a href="/timer.png" target="_blank">PNG Endpoint</a></li>
          <li><a href="/timer.svg" target="_blank">SVG Endpoint</a></li>
          <li><span class="param-hint">/timer.png?target=ISO&label=Text</span></li>
        </ul>
      </div>
      <div class="footer-bottom">
        Made with ❤️ by <a href="https://sim-lab.eu" target="_blank">Sim-Lab</a> •
        <span class="version-info">Node.js Email Tool</span>
      </div>
    </div>
  </footer>

  <div id="connectionStatus" class="connection-status">
    <span class="status-dot"></span>
    <span class="status-text">Online</span>
  </div>

  <div id="toast" class="toast"></div>

  <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
  <script>
    // ============ Configuration ============
    const STORAGE_KEY = 'countdown-builder-settings';
    const DEBOUNCE_DELAY = 500;

    const COLOR_THEMES = {
      'midnight-black': { bg: '#000000', box: '#000000', digits: '#ffffff', labels: '#ffffff', accent: '#1eb5fe' },
      'dark-gold': { bg: '#1c1917', box: '#292524', digits: '#facc15', labels: '#a8a29e', accent: '#facc15' },
      'midnight-blue': { bg: '#0f172a', box: '#1e293b', digits: '#38bdf8', labels: '#94a3b8', accent: '#38bdf8' },
      'forest-green': { bg: '#14532d', box: '#166534', digits: '#86efac', labels: '#bbf7d0', accent: '#22c55e' },
      'sunset-orange': { bg: '#431407', box: '#7c2d12', digits: '#fb923c', labels: '#fed7aa', accent: '#f97316' },
      'royal-purple': { bg: '#2e1065', box: '#4c1d95', digits: '#c084fc', labels: '#e9d5ff', accent: '#a855f7' },
      'light-minimal': { bg: '#f8fafc', box: '#e2e8f0', digits: '#1e293b', labels: '#64748b', accent: '#0ea5e9' },
      'neon-pink': { bg: '#1a1a2e', box: '#16213e', digits: '#ff2e63', labels: '#eaeaea', accent: '#ff2e63' },
      'ocean-teal': { bg: '#134e4a', box: '#115e59', digits: '#5eead4', labels: '#99f6e4', accent: '#14b8a6' },
    };

    const DEFAULT_VALUES = {
      label: 'Offer Ends In',
      timezone: 'UTC',
      template: 'boxed',
      bg: '#1c1917',
      box: '#292524',
      digits: '#facc15',
      labels: '#a8a29e',
      accent: '#facc15',
      font: "TikTok Sans, 'Outfit', sans-serif",
      fontWeight: '700',
      radius: '16',
      padding: '20',
      labelStyle: 'long'
    };

    // ============ DOM Elements ============
    const form = document.querySelector('form');
    const previewImg = document.getElementById('previewImg');
    const previewLoader = document.getElementById('previewLoader');
    const previewStatus = document.getElementById('previewStatus');
    const previewDimensions = document.getElementById('previewDimensions');
    const previewContainer = document.getElementById('previewContainer');
    const previewSkeleton = document.getElementById('previewSkeleton');
    const openNewTabLink = document.getElementById('openNewTabLink');
    const downloadSvgBtn = document.getElementById('downloadSvgBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const snippetTextarea = document.getElementById('snippet');
    const themeSelect = document.getElementById('theme');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyState = document.getElementById('copyState');
    const previewError = document.getElementById('previewError');
    const retryBtn = document.getElementById('retryBtn');
    const dateInput = document.getElementById('date');
    const dateValidation = document.getElementById('dateValidation');
    const connectionStatus = document.getElementById('connectionStatus');

    const colorFields = ['bg', 'box', 'digits', 'labels', 'accent'];
    const pickers = {};
    let debounceTimer = null;
    let currentSvgUrl = '';
    let currentPngUrl = '';
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let isFirstLoad = true;

    // Timezone search elements
    const timezoneSearch = document.getElementById('timezoneSearch');
    const timezoneSelect = document.getElementById('timezone');
    const allTimezoneOptions = Array.from(timezoneSelect.options).map(opt => ({
      value: opt.value,
      text: opt.textContent,
      selected: opt.selected
    }));

    // Toast element
    const toast = document.getElementById('toast');

    // ============ Utility Functions ============
    function debounce(fn, delay) {
      return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn(...args), delay);
      };
    }

    function showToast(message, type = 'success', duration = 2500) {
      toast.textContent = message;
      toast.className = 'toast ' + type;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    // ============ Validation Functions ============
    function isValidHexColor(color) {
      return /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    function validateColorInput(input) {
      const value = input.value.trim();
      const isValid = isValidHexColor(value);

      if (!isValid && value.length > 0) {
        input.classList.add('invalid');
        return false;
      } else {
        input.classList.remove('invalid');
        return true;
      }
    }

    function validateDateInput() {
      const dateValue = dateInput.value;
      if (!dateValue) {
        dateValidation.style.display = 'none';
        dateInput.classList.remove('warning');
        return true;
      }

      const selectedDate = new Date(dateValue);
      const now = new Date();

      if (selectedDate < now) {
        dateValidation.textContent = '⚠️ This date is in the past - timer will show 00:00:00:00';
        dateValidation.className = 'validation-message warning';
        dateValidation.style.display = 'block';
        dateInput.classList.add('warning');
        return true; // Still valid, just a warning
      } else {
        dateValidation.style.display = 'none';
        dateInput.classList.remove('warning');
        return true;
      }
    }

    function validateAllColors() {
      let allValid = true;
      colorFields.forEach(field => {
        const input = document.getElementById(field);
        if (input && !validateColorInput(input)) {
          allValid = false;
        }
      });
      return allValid;
    }

    // ============ Connection Status ============
    function updateConnectionStatus(online) {
      if (online) {
        connectionStatus.classList.remove('offline', 'visible');
        connectionStatus.querySelector('.status-text').textContent = 'Online';
      } else {
        connectionStatus.classList.add('offline', 'visible');
        connectionStatus.querySelector('.status-text').textContent = 'Offline';
      }
    }

    window.addEventListener('online', () => updateConnectionStatus(true));
    window.addEventListener('offline', () => updateConnectionStatus(false));

    // ============ Form Value Functions ============
    function getFormValues() {
      const formData = new FormData(form);
      const values = {};
      for (const [key, value] of formData.entries()) {
        values[key] = value;
      }
      return values;
    }

    function buildPreviewUrl(values) {
      const target = new Date(values.date).toISOString();
      const params = new URLSearchParams({
        target,
        label: values.label || '',
        template: values.template,
        bg: values.bg,
        box: values.box,
        digits: values.digits,
        labels: values.labels,
        accent: values.accent,
        font: values.font,
        fontWeight: values.fontWeight || '700',
        radius: values.radius || '16',
        padding: values.padding || '20',
        labelStyle: values.labelStyle || 'long',
        _: Date.now()
      });
      return '/timer.svg?' + params.toString();
    }

    function buildTimerUrls(values) {
      const target = new Date(values.date).toISOString();
      const params = new URLSearchParams({
        target,
        label: values.label || '',
        template: values.template,
        bg: values.bg,
        box: values.box,
        digits: values.digits,
        labels: values.labels,
        accent: values.accent,
        font: values.font,
        fontWeight: values.fontWeight || '700',
        radius: values.radius || '16',
        padding: values.padding || '20',
        labelStyle: values.labelStyle || 'long',
      });
      const baseParams = params.toString();
      return {
        svg: window.location.origin + '/timer.svg?' + baseParams,
        png: window.location.origin + '/timer.png?' + baseParams
      };
    }

    function buildSnippet(values) {
      const target = new Date(values.date).toISOString();
      const params = new URLSearchParams({
        target,
        label: values.label || '',
        template: values.template,
        bg: values.bg,
        box: values.box,
        digits: values.digits,
        labels: values.labels,
        accent: values.accent,
        font: values.font,
        fontWeight: values.fontWeight || '700',
        radius: values.radius || '16',
        padding: values.padding || '20',
        labelStyle: values.labelStyle || 'long',
      });
      const url = window.location.origin + '/timer.png?' + params.toString();
      const alt = values.label || 'Countdown';
      return '<img src="' + url + '" alt="' + alt + '" width="600" style="display:block;max-width:100%;height:auto;border:0;">';
    }

    function buildSnippetFormats(values) {
      const target = new Date(values.date).toISOString();
      const params = new URLSearchParams({
        target,
        label: values.label || '',
        template: values.template,
        bg: values.bg,
        box: values.box,
        digits: values.digits,
        labels: values.labels,
        accent: values.accent,
        font: values.font,
        fontWeight: values.fontWeight || '700',
        radius: values.radius || '16',
        padding: values.padding || '20',
        labelStyle: values.labelStyle || 'long',
      });
      const pngUrl = window.location.origin + '/timer.png?' + params.toString();
      const alt = values.label || 'Countdown Timer';

      return {
        html: '<img src="' + pngUrl + '" alt="' + alt + '" width="600" style="display:block;max-width:100%;height:auto;border:0;">',
        markdown: '![' + alt + '](' + pngUrl + ')',
        url: pngUrl
      };
    }

    let currentSnippetFormat = 'html';
    let currentSnippets = { html: '', markdown: '', url: '' };

    // ============ Preview Updates ============
    let retryTimeout = null;
    let currentLoadingImg = null;

    function updatePreview() {
      const values = getFormValues();
      const url = buildPreviewUrl(values);
      const urls = buildTimerUrls(values);

      // Cancel any pending retry
      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }

      // Abort previous image load if still pending
      if (currentLoadingImg) {
        currentLoadingImg.onload = null;
        currentLoadingImg.onerror = null;
        currentLoadingImg = null;
      }

      // Reset error state immediately on new update
      retryCount = 0;
      previewError.style.display = 'none';

      // Update URLs for download/open
      currentSvgUrl = urls.svg;
      currentPngUrl = urls.png;
      if (openNewTabLink) openNewTabLink.href = urls.svg;

      // Build all snippet formats
      currentSnippets = buildSnippetFormats(values);

      previewStatus.textContent = 'Updating...';
      previewStatus.className = 'preview-status updating';

      // Show skeleton on first load, otherwise show loader with pulse
      if (isFirstLoad) {
        previewSkeleton.style.display = 'block';
        previewImg.style.opacity = '0';
      } else {
        previewLoader.style.display = 'flex';
        previewContainer.classList.add('updating');
      }

      const img = new Image();
      currentLoadingImg = img;

      img.onload = () => {
        // Ignore if this is not the current loading image
        if (currentLoadingImg !== img) return;
        currentLoadingImg = null;

        previewImg.src = url;
        previewImg.style.opacity = '1';
        previewLoader.style.display = 'none';
        previewSkeleton.style.display = 'none';
        previewStatus.textContent = '';
        previewStatus.className = 'preview-status';
        isFirstLoad = false;

        // Remove pulse animation
        setTimeout(() => previewContainer.classList.remove('updating'), 300);

        // Update dimensions
        if (previewDimensions) {
          previewDimensions.textContent = img.naturalWidth + ' × ' + img.naturalHeight + ' px';
        }

        // Update snippet with current format
        snippetTextarea.value = currentSnippets[currentSnippetFormat] || currentSnippets.html;

        // Save to localStorage
        saveSettings(values);

        // Reset error state on success
        retryCount = 0;
        previewError.style.display = 'none';
      };
      img.onerror = () => {
        // Ignore if this is not the current loading image (was cancelled)
        if (currentLoadingImg !== img) return;
        currentLoadingImg = null;

        previewLoader.style.display = 'none';
        previewSkeleton.style.display = 'none';
        previewContainer.classList.remove('updating');
        previewStatus.textContent = 'Error';
        previewStatus.className = 'preview-status';

        // Show error overlay with retry button
        previewError.style.display = 'flex';

        // Auto-retry up to MAX_RETRIES times
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          previewError.querySelector('.error-text').textContent =
            'Failed to load preview. Retrying... (' + retryCount + '/' + MAX_RETRIES + ')';
          retryTimeout = setTimeout(updatePreview, 1000 * retryCount); // Exponential backoff
        } else {
          previewError.querySelector('.error-text').textContent =
            'Failed to load preview. Check your connection.';
        }
      };
      img.src = url;
    }

    const debouncedUpdatePreview = debounce(updatePreview, DEBOUNCE_DELAY);

    // ============ Download Functions ============
    async function downloadFile(url, filename) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(url, '_blank');
      }
    }

    // ============ Theme Handling ============
    function applyTheme(themeName) {
      const theme = COLOR_THEMES[themeName];
      if (!theme) return;

      colorFields.forEach(field => {
        const input = document.getElementById(field);
        if (input && theme[field]) {
          input.value = theme[field].toUpperCase();
          if (pickers[field]) {
            pickers[field].setColor(theme[field]);
          }
        }
      });

      debouncedUpdatePreview();
    }

    // ============ LocalStorage ============
    function saveSettings(values) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch (e) {
        // localStorage not available
      }
    }

    function loadSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }

    function applySettings(settings) {
      if (!settings) return;

      Object.keys(settings).forEach(key => {
        const input = document.getElementById(key);
        if (input && settings[key]) {
          input.value = settings[key];
          if (colorFields.includes(key) && pickers[key]) {
            pickers[key].setColor(settings[key]);
          }
          // Update radius display value
          if (key === 'radius') {
            const radiusValue = document.getElementById('radius-value');
            if (radiusValue) radiusValue.textContent = settings[key];
          }
        }
      });
    }

    // ============ Reset Functionality ============
    function resetToDefaults() {
      Object.keys(DEFAULT_VALUES).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
          input.value = DEFAULT_VALUES[key];
          if (colorFields.includes(key) && pickers[key]) {
            pickers[key].setColor(DEFAULT_VALUES[key]);
          }
          // Update radius display value
          if (key === 'radius') {
            const radiusValue = document.getElementById('radius-value');
            if (radiusValue) radiusValue.textContent = DEFAULT_VALUES[key];
          }
        }
      });

      themeSelect.value = 'dark-gold';

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      updatePreview();
    }

    // ============ Copy Functionality ============
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(snippetTextarea.value.trim());
        showToast('Copied to clipboard!', 'success');
      } catch (error) {
        snippetTextarea.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
      }
    });

    // ============ Initialize Color Pickers ============
    colorFields.forEach(field => {
      const textInput = document.getElementById(field);
      const pickerEl = document.getElementById(field + '-picker');

      if (textInput && pickerEl) {
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

        // Only update HEX input and preview when Save is clicked
        pickr.on('save', (color) => {
          if (color) {
            const hexColor = color.toHEXA().toString().toUpperCase();
            textInput.value = hexColor;
            themeSelect.value = '';
            debouncedUpdatePreview();
          }
          pickr.hide();
        });

        textInput.addEventListener('input', (e) => {
          let value = e.target.value.trim();
          if (value && !value.startsWith('#')) {
            value = '#' + value;
            textInput.value = value;
          }
          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            pickr.setColor(value);
            themeSelect.value = '';
            debouncedUpdatePreview();
          }
        });
      }
    });

    // ============ Event Listeners ============
    // Real-time preview for all form inputs
    form.querySelectorAll('input, select').forEach(input => {
      if (input.id !== 'theme') {
        input.addEventListener('input', debouncedUpdatePreview);
        input.addEventListener('change', debouncedUpdatePreview);
      }
    });

    // Radius slider value display
    const radiusSlider = document.getElementById('radius');
    const radiusValue = document.getElementById('radius-value');
    if (radiusSlider && radiusValue) {
      radiusSlider.addEventListener('input', (e) => {
        radiusValue.textContent = e.target.value;
      });
    }

    // Padding slider value display
    const paddingSlider = document.getElementById('padding');
    const paddingValue = document.getElementById('padding-value');
    if (paddingSlider && paddingValue) {
      paddingSlider.addEventListener('input', (e) => {
        paddingValue.textContent = e.target.value;
      });
    }

    // Date validation
    dateInput?.addEventListener('change', validateDateInput);
    dateInput?.addEventListener('input', validateDateInput);

    // Color input validation
    colorFields.forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener('blur', () => validateColorInput(input));
      }
    });

    // Retry button
    retryBtn?.addEventListener('click', () => {
      retryCount = 0;
      previewError.style.display = 'none';
      updatePreview();
    });

    // Theme selector
    themeSelect?.addEventListener('change', (e) => {
      if (e.target.value) {
        applyTheme(e.target.value);
      }
    });

    // Reset button
    resetBtn?.addEventListener('click', () => {
      if (confirm('Reset all settings to defaults?')) {
        resetToDefaults();
      }
    });

    // Download buttons
    downloadSvgBtn?.addEventListener('click', () => {
      if (currentSvgUrl) {
        downloadFile(currentSvgUrl, 'countdown-timer.svg');
      }
    });

    downloadPngBtn?.addEventListener('click', () => {
      if (currentPngUrl) {
        downloadFile(currentPngUrl, 'countdown-timer.png');
      }
    });

    // ============ Quick Duration Buttons ============
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hours = parseInt(btn.dataset.duration, 10);
        const now = new Date();
        now.setHours(now.getHours() + hours);
        // Format for datetime-local input
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        dateInput.value = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
        validateDateInput();
        debouncedUpdatePreview();
        showToast('Set to +' + (hours >= 168 ? '1 week' : hours + 'h'), 'success', 1500);
      });
    });

    // ============ Timezone Search ============
    timezoneSearch?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();

      // Clear and repopulate options
      timezoneSelect.innerHTML = '';

      const filtered = allTimezoneOptions.filter(opt =>
        opt.text.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
      );

      filtered.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.selected && !query) option.selected = true;
        timezoneSelect.appendChild(option);
      });

      // If there's a match and we have results, select the first one
      if (filtered.length > 0 && query) {
        timezoneSelect.selectedIndex = 0;
      }
    });

    // Clear search when timezone is selected
    timezoneSelect?.addEventListener('change', () => {
      timezoneSearch.value = '';
      debouncedUpdatePreview();
    });

    // ============ Keyboard Shortcuts ============
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter to apply/submit form
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        updatePreview();
        showToast('Preview updated!', 'success', 1500);
      }

      // Ctrl+C when not in an input to copy snippet
      if (e.ctrlKey && e.key === 'c' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        // Only intercept if snippet textarea is visible
        if (snippetTextarea && snippetTextarea.value) {
          e.preventDefault();
          navigator.clipboard.writeText(snippetTextarea.value.trim()).then(() => {
            showToast('Copied to clipboard!', 'success');
          }).catch(() => {
            // Fallback
            snippetTextarea.select();
            document.execCommand('copy');
            showToast('Copied to clipboard!', 'success');
          });
        }
      }
    });

    // ============ Snippet Format Tabs ============
    const snippetTabs = document.querySelectorAll('.snippet-tab');
    snippetTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active state
        snippetTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update current format and textarea
        currentSnippetFormat = tab.dataset.format;
        snippetTextarea.value = currentSnippets[currentSnippetFormat] || currentSnippets.html;
      });
    });

    // ============ Live Countdown Display ============
    const liveCountdown = document.getElementById('liveCountdown');
    let countdownInterval = null;

    function formatLiveCountdown(seconds) {
      if (seconds <= 0) return 'EXPIRED';
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      const parts = [];
      if (d > 0) parts.push(d + 'd');
      parts.push(String(h).padStart(2, '0') + 'h');
      parts.push(String(m).padStart(2, '0') + 'm');
      parts.push(String(s).padStart(2, '0') + 's');
      return parts.join(' ');
    }

    function updateLiveCountdown() {
      const dateInput = document.getElementById('date');
      if (!dateInput || !dateInput.value) {
        if (liveCountdown) liveCountdown.textContent = '';
        return;
      }

      const targetDate = new Date(dateInput.value);
      const now = new Date();
      const diffSeconds = Math.floor((targetDate - now) / 1000);

      if (liveCountdown) {
        liveCountdown.textContent = formatLiveCountdown(diffSeconds);
        liveCountdown.classList.toggle('expired', diffSeconds <= 0);
      }
    }

    function startLiveCountdown() {
      if (countdownInterval) clearInterval(countdownInterval);
      updateLiveCountdown();
      countdownInterval = setInterval(updateLiveCountdown, 1000);
    }

    // Start live countdown and restart when date changes
    startLiveCountdown();
    document.getElementById('date')?.addEventListener('change', startLiveCountdown);

    // ============ Initialize ============
    // Load saved settings on page load (only if no URL params)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() === '' || !urlParams.has('date')) {
      const saved = loadSettings();
      if (saved) {
        applySettings(saved);
        updatePreview();
      }
    }

    // Validate date on page load
    validateDateInput();

    // Initialize dimensions display
    previewImg.onload = function() {
      if (previewDimensions) {
        previewDimensions.textContent = this.naturalWidth + ' × ' + this.naturalHeight + ' px';
      }
      // Initialize URLs
      const values = getFormValues();
      const urls = buildTimerUrls(values);
      currentSvgUrl = urls.svg;
      currentPngUrl = urls.png;
    };
  </script>
</body>
</html>`;
}

module.exports = { renderPage };
