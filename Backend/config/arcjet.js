import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.js';

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),

    // ✅ Use only allow OR deny, not both
    detectBot({
      mode: "LIVE",
      allow: [ "CATEGORY:SEARCH_ENGINE" ],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 5,
    }),
  ],
});

export default aj;
