# Debugging Log - Countdown Builder

## Issue 1: Padding Value Reverting to Default

### Problem
When setting horizontal padding to 150 and clicking "Apply", the value reverted to the default 20px.

### Root Cause
The server-side code was not reading the `padding`, `radius`, `fontWeight`, and `labelStyle` parameters from the URL query string when rendering the page after form submission.

### Files Modified
1. **src/routes/home.js**
   - Updated `buildTimerParameters()` function to parse and validate the new parameters
   - Added parameters to the preview URL construction
   - Passed parameters to the `renderPage()` function

2. **src/templates/page.js**
   - Added variables to extract parameter values from data object
   - Updated form inputs to use dynamic values instead of hardcoded defaults:
     - Padding slider: `value="${paddingValue}"`
     - Radius slider: `value="${radiusValue}"`
     - Font weight select: dynamic `selected` attributes
     - Label style select: dynamic `selected` attributes

### Solution
The form now properly persists all parameter values when submitting (clicking Apply).

---

## Issue 2: Preview Failing to Load

### Problem
After fixing Issue 1, the preview image continuously failed to load with "Failed to load preview. Retrying" errors.

Console showed 404 errors:
```
GET https://aflux.nl/timer.svg?... 404 (Not Found)
```

### Root Cause Analysis

#### Discovery 1: Missing `/countdown` Path
The JavaScript was constructing URLs as `https://aflux.nl/timer.svg` instead of `https://aflux.nl/countdown/timer.svg`.

The app is running behind a reverse proxy:
- Internal URL: `http://localhost:3000/timer.svg`
- External URL: `https://aflux.nl/countdown/timer.svg`

#### Discovery 2: Server Not Aware of Base Path
The server-rendered initial preview URL was `http://localhost:3000/timer.svg`, showing the server doesn't know it's being served from `/countdown/`.

The reverse proxy isn't setting the `X-Base-Path` header that the code supports.

#### Discovery 3: Regex Escape Issue
First attempt to fix used `window.location.pathname.replace(/\/$/, '')`, but in the template literal, the `\/` wasn't properly escaped, resulting in broken regex: `//$/`

Fixed by escaping: `replace(/\\/$/, '')`

#### Discovery 4: Relative URL Resolution
Using relative URLs like `timer.svg` doesn't work correctly because:
- From `https://aflux.nl/countdown` (no trailing slash), `timer.svg` resolves to `https://aflux.nl/timer.svg`
- The page is treated as a file, not a directory

### Files Modified
**src/templates/page.js**

1. Added date validation in URL building functions:
   ```javascript
   if (!values.date) return null;
   const targetDate = new Date(values.date);
   if (isNaN(targetDate.getTime())) return null;
   ```

2. Updated `buildPreviewUrl()`:
   - Changed from absolute path `/timer.svg` to relative `timer.svg`
   - Added validation and error handling

3. Updated `buildTimerUrls()` and `buildSnippetFormats()`:
   - Extract base URL from current page: `window.location.href.split('?')[0]`
   - Remove trailing slash: `baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref`
   - Construct full URLs: `baseUrl + '/timer.svg?...'`

4. Updated `updatePreview()`:
   - Added check for null URL
   - Show error message if URL can't be built

### Solution
The JavaScript now correctly detects the base URL from the current page location and constructs proper absolute URLs that include the `/countdown/` path segment.

---

## Technical Details

### URL Construction Logic
```javascript
// Get full current page URL (e.g., https://aflux.nl/countdown or https://aflux.nl/countdown/)
const baseHref = window.location.href.split('?')[0];

// Remove trailing slash if present
const baseUrl = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;

// Result: https://aflux.nl/countdown
// Final URL: https://aflux.nl/countdown/timer.svg
```

### Form Submission Flow
1. User modifies settings (e.g., padding = 150)
2. User clicks "Apply" button
3. Form submits as GET request with all parameters
4. Page reloads with URL: `?padding=150&radius=16&...`
5. Server reads parameters via `buildTimerParameters()`
6. Server renders page with `renderPage()` using extracted values
7. Form inputs show the preserved values

### Real-time Preview Flow
1. User modifies settings
2. JavaScript `debouncedUpdatePreview` triggers (500ms delay)
3. `getFormValues()` reads current form values
4. `buildPreviewUrl()` constructs timer.svg URL with current page base
5. Image loads from `https://aflux.nl/countdown/timer.svg?...`

---

## Lessons Learned

1. **Template Literal Escaping**: When using regex in template literals, backslashes must be double-escaped (`\\`)

2. **Reverse Proxy Awareness**: Apps behind reverse proxies need to handle base path detection carefully
   - Option 1: Proxy sets `X-Base-Path` header
   - Option 2: Client-side detects from `window.location`
   - Option 3: Use fully relative URLs

3. **Form Parameter Persistence**: All form parameters must be:
   - Parsed from query string on server
   - Passed to template rendering
   - Set as default values in form inputs

4. **Browser Caching**: Major changes to inline JavaScript require aggressive cache clearing or private/incognito windows for testing

---

## Current Status
- ✅ Padding value persists correctly (stays at 150 after Apply)
- ✅ All styling parameters persist (radius, fontWeight, labelStyle)
- ✅ Preview URLs constructed with correct base path
- ⏳ Waiting for user confirmation that preview loads correctly

## Next Steps
If preview still fails after page reload, investigate:
1. Network tab to see exact URLs being requested
2. Server logs to check if requests are reaching the app
3. Reverse proxy configuration (nginx/apache)
