import express from "express";
import categoriesController from "../controller/categories-controller.js";
export const categoriesRouter = new express.Router();

categoriesRouter.post("/create", categoriesController.create);
categoriesRouter.get("/list", categoriesController.list);
categoriesRouter.get("/:name", categoriesController.get);
