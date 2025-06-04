import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  PORT, NODE_ENV,
  DB_URL,
  JWT_SECRET, JWT_EXPIRES_IN,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
 EMAIL_PASSWORD,
} = process.env;

// config/env.js
export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.SERVER_URL       // the Render URL you just set above
    : 'http://localhost:' + process.env.PORT;
