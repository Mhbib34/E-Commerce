import express from "express";
import userController from "../controller/user-controller.js";
import userAuth from "../middleware/user-auth-middleware.js";
const userRouter = new express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile", userAuth, userController.get);
userRouter.post("/send-verify-otp", userAuth, userController.verifyOtp);
userRouter.post("/verify-account", userAuth, userController.emailVerify);
userRouter.post("/send-reset-otp", userAuth, userController.resetOtp);
userRouter.post("/reset-password", userAuth, userController.resetPassword);

export default userRouter;
