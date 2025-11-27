/**
 * Email Countdown Builder
 * Main application entry point
 */

const express = require("express");
const { PORT } = require("./config");
const { homeRouter, timerRouter, healthRouter } = require("./routes");
const { requestLogger } = require("./middleware");
const { startCacheCleanup } = require("./services");

const app = express();
app.set("trust proxy", true);

// Middleware
app.use(requestLogger);

// Favicon
app.get("/favicon.svg", (req, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1c1917"/>
  <text x="50" y="65" font-size="50" text-anchor="middle" fill="#facc15">⏱</text>
</svg>`;
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(svg);
});

// Routes
app.use("/", healthRouter);
app.use("/", timerRouter);
app.use("/", homeRouter);

// Start cache cleanup
const cacheCleanupInterval = startCacheCleanup();

// Create server
const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`🚀 Countdown builder ready on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

server.on("error", (error) => {
  console.error(`❌ Unable to start countdown builder: ${error.message}`);
});

// Graceful shutdown
function shutdown() {
  console.log("\n🛑 Shutting down gracefully...");
  clearInterval(cacheCleanupInterval);
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = app;
