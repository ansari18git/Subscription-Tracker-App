import Subscription from '../models/subscription.model.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import { qstashClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

dayjs.extend(utc)

// Helper to build cron expression based on startDate and frequency
const buildCronExpression = (startDate, frequency) => {
  const dt = dayjs(startDate).utc()
  const minute = dt.minute()
  const hour = dt.hour()
  const dayOfMonth = dt.date()
  const month = dt.month() + 1
  const weekday = dt.day()

  switch (frequency) {
    case 'daily':
      return `${minute} ${hour} * * *`
    case 'weekly':
      return `${minute} ${hour} * * ${weekday}`
    case 'monthly':
      return `${minute} ${hour} ${dayOfMonth} * *`
    case 'yearly':
      return `${minute} ${hour} ${dayOfMonth} ${month} *`
    default:
      throw new Error(`Unsupported frequency: ${frequency}`)
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    // Persist subscription
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    })

    // Build cron for recurring
    const cronExpression = buildCronExpression(
      subscription.startDate,
      subscription.frequency
    )

    // Construct destination URL
    const destination = `${SERVER_URL.replace(/\/+$/,'')}/api/v1/workflows/subscription/reminder`
    console.log('Scheduling QStash job to:', destination, 'with cron:', cronExpression)

    // Schedule recurring job via QStash
    await qstashClient.publish({
      url: destination,
      cron: cronExpression,
      body: JSON.stringify({ subscriptionId: subscription.id }),
      headers: { 'Content-Type': 'application/json' }
    })

    return res.status(201).json({ success: true, data: subscription })
  } catch (error) {
    // Log full error for debugging
    console.error('Error scheduling QStash job:', error)
    return next(error)
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
    return res.status(200).json({ success: true, data: subscriptions })
  } catch (error) {
    return next(error)
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const deleted = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Subscription not found' })
    }
    return res.status(200).json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return next(error)
  }
}
