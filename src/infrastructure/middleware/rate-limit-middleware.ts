import { rateLimit } from "express-rate-limit";
import { Config } from "../config/config";

const rateLimiterMiddleware = rateLimit({
  windowMs: Config.getRateLimitWindowMs(),
  limit: Config.getRateLimit(),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: function (req, res) {
    return res.status(429).json({
      error: "Too many requests, please try again later."
    });
  }
});
export default rateLimiterMiddleware;
