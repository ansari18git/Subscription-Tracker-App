import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getUserSubscriptions,
    deleteSubscription
} from "../controllers/subscription.controller.js";

const subscriptionsRouter = Router();

subscriptionsRouter.get("/", authorize, getUserSubscriptions);
subscriptionsRouter.get("/:id", authorize,  /* your controller if needed */);
subscriptionsRouter.post("/", authorize, createSubscription);
subscriptionsRouter.put("/:id", authorize, (req, res) => res.send({title:'Update subscription'}));
subscriptionsRouter.delete("/:id", authorize, deleteSubscription);
subscriptionsRouter.put("/:id/cancel", authorize, (req, res) => res.send({title:'cancel subscriptions'}));
subscriptionsRouter.get("/upcoming-renewal", authorize, (req, res) => res.send({title:'Upcoming renewal'}));

export default subscriptionsRouter;