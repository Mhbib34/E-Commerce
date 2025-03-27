import Joi from "joi";

export const createCategoriesValidation = Joi.object({
  name: Joi.string().max(100).required(),
});
