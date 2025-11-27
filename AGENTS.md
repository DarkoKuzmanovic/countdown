# AGENTS.md - AI Agent Guidelines

This file provides context and guidelines for AI agents (GitHub Copilot, Claude, Cursor, etc.) working on this codebase.

## Project Overview

**Email Countdown Builder** is a self-hosted countdown timer generator for email marketing. It dynamically renders countdown images (SVG/PNG) that can be embedded in email campaigns.

### Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 5.x
- **Image Processing**: Sharp (SVG → PNG conversion)
- **Date Handling**: dayjs with timezone plugins
- **Frontend**: Vanilla JavaScript + Pickr color picker
- **No build step** - plain JS, no bundler required

## Project Structure

```
src/
├── app.js              # Express app entry point, graceful shutdown
├── config/             # Configuration modules
│   ├── index.js        # Config aggregator
│   ├── constants.js    # CACHE_TTL, MAX_CACHE_SIZE, valid templates
│   ├── defaults.js     # DEFAULT_STYLE object
│   └── timezones.js    # TIMEZONES and FALLBACK_TIMEZONES arrays
├── middleware/         # Express middleware
│   ├── index.js        # Middleware aggregator
│   ├── cors.js         # CORS headers for email clients
│   └── logger.js       # Request logging
├── routes/             # Route handlers
│   ├── index.js        # Route aggregator
│   ├── health.js       # GET /health endpoint
│   ├── home.js         # GET / (web UI)
│   └── timer.js        # GET /timer.svg, /timer.png
├── services/           # Business logic
│   ├── index.js        # Service aggregator
│   ├── cache.js        # PNG cache with LRU eviction
│   └── countdown.js    # buildCountdownSegments()
├── templates/          # SVG & HTML templates
│   ├── index.js        # Template registry
│   ├── boxed.js        # Boxed timer template
│   ├── minimal.js      # Minimal timer template
│   ├── minimal-narrow.js # Compact timer template
│   └── page.js         # Main HTML page (includes CSS & JS)
└── utils/              # Utility functions
    ├── index.js        # Utils aggregator
    ├── date.js         # Date formatting helpers
    ├── html.js         # escapeHtml(), escapeUrl(), buildSnippet()
    └── sanitize.js     # sanitizeColor(), sanitizeFont(), sanitizeLabel()
```

## Key Files to Know

### `src/templates/page.js`

The main HTML template (~1600 lines). Contains:

- CSS styles (lines 40-690)
- HTML structure (lines 690-870)
- JavaScript (lines 870-1600)

**Important**: This file uses template literals with `${variable}` interpolation. Be careful with backticks and dollar signs.

### `src/routes/timer.js`

Handles `/timer.svg` and `/timer.png` endpoints. This is where:

- Query parameters are parsed and sanitized
- Countdown segments are calculated
- SVG templates are rendered
- PNG conversion happens via Sharp

### `src/services/cache.js`

LRU cache for PNG images:

- `MAX_CACHE_SIZE = 1000` entries
- `CACHE_TTL = 5000ms` (5 seconds)
- Evicts oldest entries when full

### `src/templates/*.js` (boxed, minimal, minimal-narrow)

SVG template functions. Each exports a `render(data)` function that returns an SVG string.

## Coding Conventions

### JavaScript Style

- CommonJS modules (`require`/`module.exports`)
- No TypeScript
- JSDoc comments for public functions
- Template literals for HTML/SVG generation

### HTML/CSS in page.js

- CSS uses CSS custom properties (`:root` variables)
- BEM-ish class naming (`.preview-panel`, `.config-section`)
- Mobile-first responsive design with breakpoints at 900px, 768px, 600px, 400px

### Frontend JavaScript

- Vanilla JS only (no framework)
- Uses Pickr library for color pickers
- LocalStorage for settings persistence
- Debounced preview updates (500ms)

## Common Tasks

### Adding a New Timer Template

1. Create `src/templates/my-template.js` with `render(data)` function
2. Register in `src/templates/index.js`
3. Add to `VALID_TEMPLATES` in `src/config/constants.js`
4. Add option in `page.js` template selector

### Adding a New Color/Style Option

1. Add to `DEFAULT_STYLE` in `src/config/defaults.js`
2. Add sanitization in `src/utils/sanitize.js`
3. Add form field in `src/templates/page.js`
4. Update all SVG templates to use the new property

### Adding a New API Parameter

1. Parse in `src/routes/timer.js`
2. Add sanitization if needed
3. Pass to template render function
4. Update templates to use it

## Testing

Currently no automated tests. Manual testing:

```bash
npm run dev                    # Start with nodemon
curl http://localhost:3000/health
curl -I "http://localhost:3000/timer.png?target=2025-12-31T23:59:00Z"
```

## Environment Variables

```env
PORT=3000          # Server port (default: 3000)
NODE_ENV=development|production
```

## Performance Notes

- PNG cache prevents regenerating identical images
- Sharp uses libvips for fast image processing
- SVG templates are string concatenation (fast)
- Avoid blocking operations in route handlers

## Security Notes

- All user input is sanitized (colors, fonts, labels)
- `escapeHtml()` and `escapeUrl()` prevent XSS
- CORS headers allow embedding in emails
- No database, no authentication, no user data stored

## Known Limitations

- No GIF/animated output (would need different approach)
- Fonts are limited to web-safe fonts for email compatibility
- SVG blocked by some email clients (use PNG)
- No persistence/saved timers (stateless)

## Roadmap Reference

See `MVP.md` for the full development roadmap with sprints and progress tracking.

## Quick Commands

```bash
npm start          # Production start
npm run dev        # Development with hot reload
npm audit          # Check for vulnerabilities
```
