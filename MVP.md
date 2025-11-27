# Email Countdown Builder - MVP Roadmap

## Overview

This document outlines the development roadmap for transforming the Email Countdown Builder from a functional prototype into a polished MVP. The work is organized into 5 major sections, each broken down into actionable sprints.

---

## Section 1: Code Audit

### Sprint 1.1: Security Audit ✅

- [x] Review all user input sanitization (`sanitizeColor`, `sanitizeFont`, `sanitizeLabel`)
- [x] Audit `escapeHtml()` function for XSS prevention completeness
- [x] Check for potential ReDoS vulnerabilities in regex patterns
- [x] Review CORS headers configuration for production security
- [x] Audit Express trust proxy settings for reverse proxy scenarios
- [x] Check for potential path traversal or injection vulnerabilities

### Sprint 1.2: Performance Audit ✅

- [x] Analyze PNG cache implementation for memory leaks (Map without size limit) → **Fixed: Added MAX_CACHE_SIZE=1000**
- [x] Review Sharp image processing for optimization opportunities → **Added: compression, adaptive filtering, palette mode**
- [x] Add memory monitoring to health endpoint
- [ ] Audit SVG rendering for redundant string operations
- [ ] Measure and document current response times for `/timer.png` and `/timer.svg`
- [ ] Review dayjs usage for unnecessary timezone recalculations
- [ ] Check for blocking operations that could be optimized

### Sprint 1.3: Code Quality Audit

- [ ] Identify code duplication (e.g., repeated color/label parsing in routes)
- [ ] Review function sizes and complexity (renderPage is 300+ lines)
- [ ] Audit error handling completeness across all routes
- [ ] Check for missing input validation edge cases
- [ ] Review console.log usage for production readiness
- [ ] Document technical debt and improvement opportunities

### Sprint 1.4: Dependency Audit

- [ ] Review Express 5.x usage (currently in beta/RC)
- [x] Check for security vulnerabilities with `npm audit` → **0 vulnerabilities found**
- [ ] Evaluate Sharp version compatibility and system requirements
- [ ] Review dayjs plugins for necessity
- [ ] Check for missing production dependencies (helmet, compression, etc.)

---

## Section 2: Code Refactoring

### Sprint 2.1: Project Structure Setup ✅

- [x] Create `/src` directory structure:
  ```
  src/
  ├── config/
  ├── routes/
  ├── templates/
  ├── utils/
  ├── middleware/
  └── services/
  ```
- [x] Set up path aliases or consistent import patterns
- [x] Create main entry point that imports from modules

### Sprint 2.2: Extract Configuration ✅

- [x] Move `DEFAULT_STYLE` to `src/config/defaults.js`
- [x] Move `TIMEZONES` and `FALLBACK_TIMEZONES` to `src/config/timezones.js`
- [x] Create `src/config/constants.js` for `CACHE_TTL`, valid templates, etc.
- [x] Create environment-based configuration with dotenv
- [ ] Add configuration validation on startup

### Sprint 2.3: Extract Utilities ✅

- [x] Move sanitization functions to `src/utils/sanitize.js`
- [x] Move `escapeHtml` to `src/utils/html.js`
- [x] Move date formatting helpers to `src/utils/date.js`
- [x] Move `buildSnippet` to `src/utils/html.js` (combined with escapeHtml)
- [x] Add JSDoc comments to all utility functions

### Sprint 2.4: Extract Templates ✅

- [x] Move `renderBoxedTemplate` to `src/templates/boxed.js`
- [x] Move `renderMinimalTemplate` to `src/templates/minimal.js`
- [x] Move `renderMinimalNarrowTemplate` to `src/templates/minimal-narrow.js`
- [x] Create `src/templates/index.js` template registry
- [x] Move `renderPage` HTML to `src/templates/page.js`
- [ ] Consider using template literals or a lightweight templating engine

### Sprint 2.5: Extract Routes & Middleware ✅

- [x] Create `src/routes/home.js` for `/` route
- [x] Create `src/routes/timer.js` for `/timer.svg` and `/timer.png` routes
- [x] Create `src/middleware/cors.js` for CORS handling
- [x] Create `src/services/cache.js` for caching logic
- [x] Create `src/services/countdown.js` for `buildCountdownSegments`

### Sprint 2.6: Implement Proper Error Handling (Partial) ✅

- [ ] Create custom error classes in `src/utils/errors.js`
- [ ] Add global error handling middleware
- [x] Add request logging middleware
- [x] Create health check endpoint
- [x] Add graceful shutdown handling

---

## Section 3: UI Polish

### Sprint 3.1: Visual Design Improvements ✅

- [x] Add loading state/skeleton for preview image → **Shimmer skeleton on first load**
- [x] Improve mobile responsiveness (form stacking, touch targets) → **Full mobile layout, 768px & 400px breakpoints**
- [x] Add visual feedback when settings change (preview update indicator) → **Pulse animation on container**
- [x] Improve color picker integration (larger touch targets on mobile) → **52px touch targets**
- [x] Add subtle animations for form interactions → **Focus lift, label highlight transitions**
- [x] Improve textarea styling for code snippet → **Snippet container with line-numbers effect**
- [x] Added touch device optimizations (`hover: none` media query)
- [x] Added reduced motion support (`prefers-reduced-motion`)

### Sprint 3.2: Layout & Typography ✅

- [x] Complete layout redesign - two-column layout (Preview+Embed left, Config right)
- [x] Fixed color picker proportions - text input takes flex, small 36px color swatch
- [x] Compact 2-column grid for color inputs
- [x] Improved section spacing and visual hierarchy
- [x] Added collapsible platform tips section
- [x] Improved label/input associations and grouping
- [x] Added visual separators between form sections
- [ ] Review and optimize font loading (consider self-hosting fonts)
- [ ] Add proper favicon and app icons

### Sprint 3.3: Accessibility Improvements

- [ ] Add proper ARIA labels to all form controls
- [ ] Ensure sufficient color contrast ratios (WCAG AA)
- [ ] Add focus visible states for keyboard navigation
- [ ] Add screen reader announcements for copy action
- [ ] Test and fix tab order
- [ ] Add skip links if needed

### Sprint 3.4: Cross-Browser & Device Testing

- [ ] Test on Safari (macOS/iOS)
- [ ] Test on Firefox
- [ ] Test on Edge
- [ ] Test on mobile devices (iOS Safari, Chrome Android)
- [ ] Fix any browser-specific CSS issues
- [ ] Test color picker functionality across browsers

---

## Section 4: UX Polish

### Sprint 4.1: Form Usability ✅

- [x] Add real-time preview updates (debounced)
- [x] Add "Reset to defaults" button
- [x] Remember last used settings in localStorage
- [x] Add preset themes/color schemes dropdown
- [x] Improve timezone selector with search/filter → **Added search input above dropdown**
- [x] Add "quick select" for common countdown durations (24h, 48h, 1 week) → **+1h, +24h, +48h, +1 week buttons**

### Sprint 4.2: Preview & Export Improvements ✅

- [ ] Add live countdown in preview (JavaScript animation)
- [ ] Add preview size toggle (1x, 2x, actual size)
- [x] Add "Open in new tab" link for preview
- [x] Show image dimensions next to preview
- [x] Add download button for PNG/SVG
- [ ] Add QR code for quick mobile preview

### Sprint 4.3: Snippet & Integration ✅

- [x] Add multiple snippet formats (HTML, Markdown, URL only)
- [x] Add ESP-specific instructions (Klaviyo, Mailchimp, etc.)
- [x] Show "copy successful" toast notification → **Animated toast at bottom of screen**
- [ ] Add snippet syntax highlighting
- [ ] Add "Test in email" instructions/tips
- [ ] Add fallback image URL for when countdown expires

### Sprint 4.4: Error States & Validation ✅

- [x] Add inline validation for color inputs
- [x] Add warning for past dates
- [x] Add error state when image fails to load
- [x] Add helpful error messages with recovery suggestions
- [x] Add connection status indicator
- [x] Add retry mechanism for failed preview loads

### Sprint 4.5: Onboarding & Help

- [x] Add tooltips for each form field → **data-tooltip on key fields**
- [ ] Add "How it works" explanation section
- [ ] Add FAQ section
- [ ] Add example use cases with screenshots
- [x] Add keyboard shortcuts for common actions → **Ctrl+Enter apply, Ctrl+C copy**
- [ ] Add first-time user guided tour (optional)

---

## Section 5: MVP Features

### Sprint 5.1: Core Feature Enhancements

- [ ] Add more timer templates (circular, flip clock, neon, etc.)
- [ ] Add support for custom expiry message/image
- [ ] Add ability to hide specific time units (e.g., hide days if < 24h)
- [ ] Add support for count-up timers (time since event)
- [ ] Add "evergreen" mode (countdown resets for each viewer)
- [ ] Add custom width/height controls

### Sprint 5.2: Styling Options

- [ ] Add border radius customization
- [ ] Add drop shadow on/off toggle
- [ ] Add transparency/opacity support
- [ ] Add custom separator characters
- [ ] Add unit label customization (D/H/M/S vs Days/Hours/etc.)
- [ ] Add text alignment options

### Sprint 5.3: Advanced Customization

- [ ] Add Google Fonts integration with font picker
- [ ] Add gradient background support
- [ ] Add background image/pattern support
- [ ] Add custom CSS injection for advanced users
- [ ] Add image padding/margin controls
- [ ] Add animation style options (for GIF output)

### Sprint 5.4: Output Formats & Quality

- [ ] Add GIF output format (animated countdown)
- [ ] Add configurable image quality/compression
- [ ] Add 2x/3x resolution options for retina displays
- [ ] Add WebP output format
- [ ] Add URL shortener integration
- [ ] Add CDN caching headers optimization

### Sprint 5.5: Persistence & Management

- [ ] Add timer save/load functionality (with unique IDs)
- [ ] Add timer management dashboard
- [ ] Add timer duplication feature
- [ ] Add timer sharing via URL
- [ ] Add timer analytics (view count, opens by time)
- [ ] Add timer expiration notifications

### Sprint 5.6: API & Integration

- [ ] Add documented REST API
- [ ] Add API authentication for production use
- [ ] Add rate limiting
- [ ] Add webhook notifications (countdown expired)
- [ ] Add Zapier/Make integration
- [ ] Add embeddable widget option

### Sprint 5.7: DevOps & Production Readiness

- [ ] Add Docker support with Dockerfile
- [ ] Add docker-compose for easy deployment
- [ ] Add health check endpoint
- [ ] Add structured logging (pino/winston)
- [ ] Add metrics endpoint (Prometheus format)
- [ ] Add environment-specific configurations
- [ ] Add CI/CD pipeline configuration
- [ ] Add automated testing setup

---

## Priority Matrix

| Priority  | Section      | Sprint       | Effort | Impact           |
| --------- | ------------ | ------------ | ------ | ---------------- |
| 🔴 High   | 1 - Audit    | 1.1 Security | Medium | Critical         |
| 🔴 High   | 2 - Refactor | 2.1-2.3      | High   | High             |
| 🟡 Medium | 3 - UI       | 3.1-3.2      | Medium | Medium           |
| 🟡 Medium | 4 - UX       | 4.1-4.2      | Medium | High             |
| 🟢 Low    | 5 - Features | 5.1-5.2      | High   | Medium           |
| 🟢 Low    | 5 - Features | 5.5-5.7      | High   | High (long-term) |

---

## Quick Wins (Can be done immediately) ✅

1. ~~Add `helmet` middleware for security headers~~ (deferred - Express 5 compatibility)
2. ~~Add `compression` middleware for response compression~~ (deferred - Express 5 compatibility)
3. [x] Add `.env` file support with `dotenv`
4. [x] Add basic request logging
5. [x] Add favicon
6. [x] Fix console.log for production (use proper logger)
7. [x] Add health check endpoint (`/health`)
8. [x] Add `npm run dev` script with nodemon

---

## Technical Notes

### Current Stack

- **Runtime**: Node.js
- **Framework**: Express 5.x
- **Image Processing**: Sharp
- **Date Handling**: dayjs with timezone plugins
- **Frontend**: Vanilla JS + Pickr color picker

### Project Structure (Refactored ✅)

```
src/
├── app.js              # Main entry point
├── config/             # Configuration files
│   ├── index.js
│   ├── constants.js
│   ├── defaults.js
│   └── timezones.js
├── middleware/         # Express middleware
│   ├── index.js
│   ├── cors.js
│   └── logger.js
├── routes/             # Route handlers
│   ├── index.js
│   ├── health.js
│   ├── home.js
│   └── timer.js
├── services/           # Business logic
│   ├── index.js
│   ├── cache.js
│   └── countdown.js
├── templates/          # SVG & HTML templates
│   ├── index.js
│   ├── boxed.js
│   ├── minimal.js
│   ├── minimal-narrow.js
│   └── page.js
└── utils/              # Utility functions
    ├── index.js
    ├── date.js
    ├── html.js
    └── sanitize.js
```

### File Size (Before Refactoring)

- `server.js`: ~750 lines (now legacy, kept for reference)

### Dependencies to Consider Adding

- `helmet` - Security headers
- `compression` - Response compression
- `dotenv` - Environment variables
- `pino` or `winston` - Logging
- `nodemon` - Development hot reload
- `jest` or `vitest` - Testing
- `eslint` + `prettier` - Code quality
