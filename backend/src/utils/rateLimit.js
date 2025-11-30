const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  keyGenerator: (req) => req.user?.id || req.ip, // use req.user.id else use ip
  windowMs: 1 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Try again after 1 min."
    });
  }
});

module.exports = rateLimiter;
