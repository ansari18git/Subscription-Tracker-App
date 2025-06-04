import Subscription from '../models/subscription.model.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import { qstashClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

dayjs.extend(utc)

// Helper: create a cron expression based on startDate and frequency
const buildCronExpression = (startDate, frequency) => {
  const dt = dayjs(startDate).utc()
  const minute = dt.minute()
  const hour = dt.hour()
  const dayOfMonth = dt.date()
  const month = dt.month() + 1 // Cron months are 1-12
  const weekday = dt.day()    // 0-6 (Sunday-Saturday)

  switch (frequency) {
    case 'daily':
      return `${minute} ${hour} * * *`         // Every day at hour:minute
    case 'weekly':
      return `${minute} ${hour} * * ${weekday}` // Once a week on the same weekday
    case 'monthly':
      return `${minute} ${hour} ${dayOfMonth} * *` // Once a month on the same date
    case 'yearly':
      return `${minute} ${hour} ${dayOfMonth} ${month} *` // Once a year on the same month and date
    default:
      throw new Error(`Unsupported frequency: ${frequency}`)
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    // Persist the subscription
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    })

    // Build cron expression for the requested frequency
    const cronExpression = buildCronExpression(
      subscription.startDate,
      subscription.frequency
    )

    // Schedule a recurring reminder via QStash
    await qstashClient.schedule({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      cron: cronExpression,
      body: JSON.stringify({ subscriptionId: subscription.id }),
      headers: { 'Content-Type': 'application/json' }
    })

    // Respond with the created subscription
    return res.status(201).json({ success: true, data: subscription })
  } catch (error) {
    return next(error)
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user._id
    const subscriptions = await Subscription.find({ user: userId })
    return res.status(200).json({ success: true, data: subscriptions })
  } catch (error) {
    return next(error)
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { id } = req.params
    const deleted = await Subscription.findOneAndDelete({ _id: id, user: userId })
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Subscription not found' })
    }
    return res.status(200).json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return next(error)
  }
}
