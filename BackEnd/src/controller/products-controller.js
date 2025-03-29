import { create, get, update } from "../services/products-services.js";

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

const getProductHandler = async (req, res, next) => {
  try {
    const { name } = req.query;
    const result = await get(name);
    res.status(200).json({
      success: true,
      message: `${result.name} found`,
      product: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await update(id, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create: createProductHandler,
  get: getProductHandler,
  update: updateProductHandler,
};
