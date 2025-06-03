import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getUser,getUsers } from "../controllers/user.controller.js";


const usersRouter = Router();

usersRouter.get("/",getUsers)

usersRouter.get("/:id",authorize,getUser)

usersRouter.post("/",(req,res)=>{ res.send({title:'CREATE user'})})

usersRouter.put("/:id",(req,res)=>{ res.send({title:'Replace user'})})

usersRouter.delete("/:id",(req,res)=>{ res.send({title:'DELETE user'})})

export default usersRouter;