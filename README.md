# Email Countdown Builder

A self-hosted, high-performance email countdown timer generator that creates dynamic countdown images for email marketing campaigns. Built with Node.js, Express, and Sharp for optimal performance.

![Email Countdown Builder](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-5.x-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core

- **Dynamic Countdown Generation**: Real-time countdown timers that update on each request
- **Multiple Templates**: Boxed, Minimal, and Compact styles
- **Full Customization**: Colors, fonts, labels via color picker UI or URL parameters
- **Email Client Compatible**: PNG images work in Gmail, Outlook, Apple Mail, and all major clients

### UI/UX

- **Live Preview**: Real-time preview updates as you customize
- **Theme Presets**: 8 built-in color themes (Dark Gold, Midnight Blue, Forest Green, etc.)
- **Quick Duration Buttons**: +1h, +24h, +48h, +1 week shortcuts
- **Timezone Search**: Filter through 400+ timezones
- **Multiple Export Formats**: HTML, Markdown, or URL-only snippets
- **Keyboard Shortcuts**: Ctrl+Enter to apply, Ctrl+C to copy
- **Toast Notifications**: Visual feedback for actions
- **Mobile Responsive**: Works on all screen sizes

### Performance

- **LRU Cache**: 5-second in-memory cache (1000 entries max)
- **Optimized PNG**: Sharp with compression, adaptive filtering, palette mode
- **Memory Monitoring**: Health endpoint with memory stats
- **Handles 15,000+ emails/day** on 2GB RAM

## Tech Stack

- **Node.js 18+** - Runtime environment
- **Express 5.x** - Web framework
- **Sharp** - High-performance image processing (SVG → PNG)
- **Day.js** - Lightweight date/time with timezone support
- **Pickr** - Color picker component
- **dotenv** - Environment configuration

## Project Structure

```
src/
├── app.js              # Express app entry point
├── config/             # Configuration (defaults, timezones, constants)
├── middleware/         # CORS, logging
├── routes/             # API endpoints (/, /timer.svg, /timer.png, /health)
├── services/           # Cache, countdown calculation
├── templates/          # SVG templates + HTML page
└── utils/              # Sanitization, HTML escaping, date helpers
```

See [AGENTS.md](AGENTS.md) for detailed documentation for AI agents and contributors.

## Requirements

- Node.js 18+ (with npm)
- 2GB RAM minimum
- Linux server (Ubuntu/Debian recommended)
- Nginx (for reverse proxy)
- systemd (for process management)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd email-countdown-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your preferred port (default: 9500):

```env
PORT=9500
NODE_ENV=production
```

### 4. Test the Application

```bash
npm start        # Production
npm run dev      # Development with hot reload
```

Visit `http://localhost:3000` to verify it's working (default port is 3000).

## Production Setup

### Nginx Configuration

Add a reverse proxy configuration to your Nginx site config:

```nginx
location /countdown {
    rewrite ^/countdown(/.*)$ $1 break;
    rewrite ^/countdown$ / break;
    proxy_pass http://localhost:9500;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Base-Path /countdown;
    proxy_cache_bypass $http_upgrade;
}
```

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Systemd Service Setup

Create a systemd service file for automatic startup and restarts:

```bash
sudo nano /etc/systemd/system/countdown.service
```

Add the following content (adjust paths and user as needed):

```ini
[Unit]
Description=Email Countdown Builder Service
After=network.target

[Service]
Type=simple
User=your-username
Group=your-username
WorkingDirectory=/path/to/email-countdown-builder
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node /path/to/email-countdown-builder/src/app.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=countdown

[Install]
WantedBy=multi-user.target
```

**Important**: Replace the following:

- `your-username` - Your server username
- `/path/to/email-countdown-builder` - Full path to the application directory
- `/usr/bin/node` - Path to Node.js (find with `which node`)

Enable and start the service:

```bash
# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable countdown

# Start the service
sudo systemctl start countdown

# Check status
sudo systemctl status countdown
```

### Verify Installation

Check that the service is running:

```bash
sudo systemctl status countdown
```

Test the endpoints:

```bash
# Test through localhost
curl -I http://localhost:9500/timer.png?date=2025-12-31T23:59&label=New%20Year

# Test through Nginx (replace with your domain)
curl -I https://yourdomain.com/countdown/timer.png?date=2025-12-31T23:59&label=New%20Year
```

You should see `HTTP/1.1 200 OK` and `Content-Type: image/png`.

## Usage

### Web Interface

Visit `https://yourdomain.com/countdown` to access the visual builder:

1. Enter your target date and time
2. Add a headline (optional)
3. Choose a template style
4. Customize colors using the color picker
5. Click "Generate Snippet"
6. Copy the HTML snippet to your email template

### API Endpoints

#### PNG Image Endpoint

```
GET /timer.png
```

**Query Parameters:**

| Parameter  | Type   | Required | Default               | Description                                              |
| ---------- | ------ | -------- | --------------------- | -------------------------------------------------------- |
| `target`   | string | Yes      | -                     | Target date in ISO format (e.g., `2025-12-31T23:59:00Z`) |
| `label`    | string | No       | "Offer Ends In"       | Countdown headline                                       |
| `template` | string | No       | "boxed"               | Template style: `boxed`, `minimal`, `minimal-narrow`     |
| `bg`       | string | No       | `#1c1917`             | Background color (hex)                                   |
| `box`      | string | No       | `#292524`             | Box/container color (hex)                                |
| `digits`   | string | No       | `#facc15`             | Digit text color (hex)                                   |
| `labels`   | string | No       | `#a8a29e`             | Label text color (hex)                                   |
| `accent`   | string | No       | `#facc15`             | Accent/headline color (hex)                              |
| `font`     | string | No       | "TikTok Sans, Outfit" | Font stack                                               |

**Example:**

```html
<img
  src="https://yourdomain.com/timer.png?target=2025-12-31T23:59:00Z&label=Sale%20Ends&template=minimal&bg=%231c1917&digits=%23facc15"
  alt="Countdown Timer"
  width="600"
  style="display:block;max-width:100%;height:auto;"
/>
```

#### SVG Endpoint (for web use)

```
GET /timer.svg
```

Same parameters as PNG endpoint. Note: SVG images may be blocked by some email clients (Gmail, Outlook) for security reasons. Use PNG for email.

## Templates

### Boxed

Classic style with rounded boxes for each time unit. Best for prominent countdowns.

### Minimal

Clean, spacious design with colon separators. Great for modern email designs.

### Minimal Narrow

Compact version of Minimal template, ~70% width. Perfect for sidebar or mobile layouts.

## Caching & Performance

- **In-Memory Caching**: 5-second cache reduces server load by ~99% during peak traffic
- **Efficient Processing**: Sharp library provides fast SVG to PNG conversion
- **Scalability**: Handles 15,000+ email opens per day on 2GB RAM
- **Cache Monitoring**: `X-Cache` header shows HIT/MISS for debugging

Check cache performance:

```bash
curl -I https://yourdomain.com/timer.png?target=2025-12-31T23:59:00Z | grep X-Cache
# First request: X-Cache: MISS
# Within 5 seconds: X-Cache: HIT
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
# Returns: {"status":"ok","uptime":123.45,"memory":{"heapUsedMB":25,"heapTotalMB":50,"rssMB":75}}
```

### Service Logs

View service logs:

```bash
# View recent logs
sudo journalctl -u countdown -n 50

# Follow logs in real-time
sudo journalctl -u countdown -f

# Check service status
sudo systemctl status countdown
```

Restart the service:

```bash
sudo systemctl restart countdown
```

## Troubleshooting

### Service won't start

Check logs for errors:

```bash
sudo journalctl -u countdown -n 100 --no-pager
```

Common issues:

- Port already in use (change PORT in .env)
- Missing node_modules (run `npm install`)
- Wrong Node.js path in service file (find with `which node`)

### Images not loading in emails

- Ensure you're using `/timer.png` endpoint (not `.svg`)
- Check CORS headers are present
- Verify the countdown service is accessible from the internet
- Test the full URL in a browser first

### Cache not working

Check `X-Cache` header:

```bash
curl -I http://localhost:9500/timer.png?date=2025-12-31T23:59 | grep X-Cache
```

If always showing MISS, check server logs for errors.

## Development

Run in development mode:

```bash
NODE_ENV=development npm start
```

The application will run on the port specified in `.env` (default: 9500).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
