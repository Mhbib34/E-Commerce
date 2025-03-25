import express from "express";
import userController from "../controller/user-controller.js";
const userRouter = new express.Router();

userRouter.post("/api/users/register", userController.register);
userRouter.post("/api/users/login", userController.login);

export default userRouter;
