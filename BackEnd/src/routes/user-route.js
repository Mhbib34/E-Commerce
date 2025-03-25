import express from "express";
import userController from "../controller/user-controller.js";
import userAuth from "../middleware/user-auth-middleware.js";
const userRouter = new express.Router();

userRouter.post("/api/users/register", userController.register);
userRouter.post("/api/users/login", userController.login);
userRouter.post("/api/users/logout", userController.logout);
userRouter.get("/api/users", userAuth, userController.get);
userRouter.post(
  "/api/users/send-verify-otp",
  userAuth,
  userController.verifyOtp
);
userRouter.post(
  "/api/users/verify-account",
  userAuth,
  userController.emailVerify
);

export default userRouter;
