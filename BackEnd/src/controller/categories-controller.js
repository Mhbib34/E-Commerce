import { create, get, list } from "../services/categories-services.js";

const createCategoriesHandler = async (req, res, next) => {
  try {
    const result = await create(req.body);
    res.status(201).json({
      success: true,
      message: "Categories created successfuly",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const listCategoriesHandler = async (req, res, next) => {
  try {
    const result = await list();
    res.status(200).json({
      success: true,
      message: "Get all category",
      category: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoriesHandler = async (req, res, next) => {
  try {
    const { name } = req.params;
    const result = await get(name);
    res.status(200).json({
      success: true,
      message: `${result.name} found it`,
      category: result,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  create: createCategoriesHandler,
  list: listCategoriesHandler,
  get: getCategoriesHandler,
};
