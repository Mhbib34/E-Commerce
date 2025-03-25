import express from "express";
import userRouter from "../routes/user-route.js";
import errorMiddleware from "../error/error-middleware.js";
export const app = express();
app.use(express.json());
app.use(userRouter);
app.use(errorMiddleware);
