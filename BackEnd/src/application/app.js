import express from "express";
import userRouter from "../routes/user-route.js";
import errorMiddleware from "../error/error-middleware.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuth from "../middleware/user-auth-middleware.js";
export const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRouter);
app.use(userAuth);
app.use(errorMiddleware);
