/**
 * Request logging middleware
 */

/**
 * Simple request logger
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    const message = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;

    if (logLevel === "warn") {
      console.warn(message);
    } else if (process.env.NODE_ENV !== "production" || req.path === "/health") {
      // In production, only log health checks and errors
    } else {
      console.log(message);
    }
  });

  next();
}

module.exports = { requestLogger };
