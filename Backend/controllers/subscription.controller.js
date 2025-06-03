import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
      console.log('Creating subscription and about to trigger workflow for:', subscription.id);

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })
  console.log('Workflow triggered, runId:', workflowRunId);
    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user._id; // or req.user.userId depending on your middleware
    const subscriptions = await Subscription.find({ user: userId });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const deleted = await Subscription.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Subscription not found" });
    }
    res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (e) {
    next(e);
  }
};