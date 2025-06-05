import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.js';

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"], // Tracks IP to identify users/bots and rate limit

  rules: [
    // ✅ Basic shielding (required)
    shield({ mode: "LIVE" }),

    // ✅ Enable bot detection
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow Google, Bing, etc.
      ],
      deny: [
        "CATEGORY:AUTO",          // Deny known bots
        "CATEGORY:SCRAPER",       // Deny scraping tools
      ],
    }),

    // ✅ Enable token bucket rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 3,   // 3 tokens every interval
      interval: 60,    // Refill every 60 seconds
      capacity: 5,     // Max 5 requests per user per minute
    }),
  ],
});

export default aj;
