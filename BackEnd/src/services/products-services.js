import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createProductValidation } from "../validation/products-validation.js";
import validate from "../validation/validation.js";

export const create = async (request) => {
  const product = validate(createProductValidation, request);
  const countProduct = await prismaClient.products.count({
    where: {
      name: product.name,
    },
  });
  if (countProduct === 1)
    throw new ResponseError(400, "Products already exist");

  let category = await prismaClient.category.findUnique({
    where: {
      name: product.categoryName,
    },
  });
  if (!category) {
    category = await prismaClient.category.create({
      data: {
        name: product.categoryName,
      },
    });
  }
  return prismaClient.products.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: category.id,
    },
    include: { category: true },
  });
};
