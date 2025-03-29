import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createProductValidation,
  getProductValidation,
  updateProductValidation,
} from "../validation/products-validation.js";
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

export const get = async (name) => {
  name = validate(getProductValidation, name);
  const product = await prismaClient.products.findFirst({
    where: {
      name: {
        contains: name.toLowerCase(),
      },
    },
  });

  if (!product) throw new ResponseError(404, "Product not found");

  return product;
};

export const update = async (id, request) => {
  request = validate(updateProductValidation, request);
  if (!id) throw new ResponseError(400, "Product ID is required");

  let categoryId = undefined;
  if (request.categoryName) {
    const category = await prismaClient.category.findUnique({
      where: { name: request.categoryName },
    });

    if (!category) throw new ResponseError(404, "Category not found");

    categoryId = category.id;
  }

  delete request.categoryName;

  Object.keys(request).forEach((key) => {
    if (request[key] === "") {
      delete request[key];
    }
  });

  const updatedProduct = await prismaClient.products.update({
    where: { id },
    data: {
      ...request,
      ...(categoryId && { categoryId }),
    },
    include: {
      category: true,
    },
  });

  return updatedProduct;
};
