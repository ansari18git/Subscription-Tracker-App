/*import { Client as WorkflowClient } from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});*/

import { Client as QStashClient } from "@upstash/qstash";
import { QSTASH_TOKEN } from "./env.js";

export const qstashClient = new QStashClient({ token: QSTASH_TOKEN });
