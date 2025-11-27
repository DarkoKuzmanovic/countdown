/**
 * Central routes exports
 */

const homeRouter = require("./home");
const timerRouter = require("./timer");
const healthRouter = require("./health");

module.exports = {
  homeRouter,
  timerRouter,
  healthRouter,
};
