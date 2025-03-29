import express from "express";
import productsController from "../controller/products-controller.js";
export const productsRouter = new express.Router();

productsRouter.post("/create", productsController.create);
productsRouter.get("/search", productsController.get);
productsRouter.patch("/:id", productsController.update);
