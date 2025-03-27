import { create } from "../services/products-services.js";

const createProductHandler = async (req, res, next) => {
  try {
    const result = await create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfuly",
      product: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create: createProductHandler,
};
