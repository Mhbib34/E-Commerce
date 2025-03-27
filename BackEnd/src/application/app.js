import express from "express";
import userRouter from "../routes/user-route.js";
import errorMiddleware from "../error/error-middleware.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { productsRouter } from "../routes/product-routes.js";
import { categoriesRouter } from "../routes/categories-routes.js";
import { orderRouter } from "../routes/order-routes.js";
import { cartRouter } from "../routes/cart-routes.js";
export const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use(errorMiddleware);
