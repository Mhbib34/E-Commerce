import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createCategoriesValidation,
  getCategoriesValidation,
} from "../validation/categories-validation.js";
import validate from "../validation/validation.js";

export const create = async (request) => {
  const categories = validate(createCategoriesValidation, request);
  const categoriesCount = await prismaClient.category.count({
    where: {
      name: categories.name,
    },
  });
  if (categoriesCount === 1)
    throw new ResponseError(400, "Category already exist");

  return prismaClient.category.create({
    data: categories,
    select: {
      id: true,
      name: true,
    },
  });
};

export const list = async () => {
  return prismaClient.category.findMany();
};

export const get = async (name) => {
  name = validate(getCategoriesValidation, name);

  const category = await prismaClient.category.findUnique({
    where: { name },
  });

  if (!category) {
    throw new ResponseError(404, "Category is not found");
  }

  return category;
};
