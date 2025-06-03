import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1, 0];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log('sendReminders workflow started for:', subscriptionId);

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate).utc();
  const now = dayjs().utc();
  if (renewalDate.isBefore(now)) return;

  const maxDelay = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    // Only schedule or send reminders within the maxDelay window
    if (reminderDate.isAfter(now)) {
      if (reminderDate.diff(now, 'millisecond') <= maxDelay) {
        await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
      }
    }
    if (now.isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  console.log(`About to send reminder: ${label} for ${subscription.user?.email}`);
  return await context.run(label, async () => {
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};