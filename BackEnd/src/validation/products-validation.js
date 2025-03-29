import Joi from "joi";

export const createProductValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().required(),
  stock: Joi.number().optional().allow(""),
  categoryInt: Joi.number().optional(),
  categoryName: Joi.string().optional().max(100),
});
export const updateProductValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().required(),
  stock: Joi.number().optional().allow(""),
  categoryName: Joi.string().optional().max(100),
});

export const getProductValidation = Joi.string()
  .trim()
  .min(1)
  .max(100)
  .required();
