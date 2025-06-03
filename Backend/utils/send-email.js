import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
    console.log(`Sending email to: ${to} for subscription: ${subscription.name} (${type})`);
  if (!to || !type) throw new Error('Missing required parameters');

  const template = emailTemplates.find((t) => t.label === type);
  if (!template) throw new Error('Invalid email type');

  // Ensure userName is available
  const userName = subscription.user?.name || 'User';

  const mailInfo = {
    userName,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}