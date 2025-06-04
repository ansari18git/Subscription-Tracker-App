import Subscription from '../models/subscription.model.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import { qstashClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

dayjs.extend(utc)

// Map frequency to cron expression based on subscription startDate
const buildCronExpression = (startDate, frequency) => {
  const dt = dayjs(startDate).utc()
  const m = dt.minute()
  const h = dt.hour()
  const D = dt.date()
  const W = dt.day() // 0 (Sunday) - 6
  const M = dt.month() + 1 // 1 - 12

  switch (frequency) {
    case 'daily':
      // every day at hour:h minute:m
      return `${m} ${h} * * *`
    case 'weekly':
      // every week on the same weekday at hour and minute
      return `${m} ${h} * * ${W}`
    case 'monthly':
      // every month on the same day
      return `${m} ${h} ${D} * *`
    case 'yearly':
      // once a year on the same month and day
      return `${m} ${h} ${D} ${M} *`
    default:
      throw new Error(`Unsupported frequency: ${frequency}`)
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    })

    // Build cron expression for recurring reminders
    const cron = buildCronExpression(subscription.startDate, subscription.frequency)

    // Schedule recurring job via QStash
    await qstashClient.schedule({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      cron,
      body: JSON.stringify({ subscriptionId: subscription.id }),
      headers: { 'Content-Type': 'application/json' },
    })

    res.status(201).json({ success: true, data: subscription })
  } catch (e) {
    next(e)
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user._id
    const subscriptions = await Subscription.find({ user: userId })
    res.status(200).json({ success: true, data: subscriptions })
  } catch (e) {
    next(e)
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
    res.status(200).json({ success: true, message: 'Subscription deleted' })
  } catch (e) {
    next(e)
  }
}
