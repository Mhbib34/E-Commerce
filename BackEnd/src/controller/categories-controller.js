import { create } from "../services/categories-services.js";

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

export default {
  create: createCategoriesHandler,
};
