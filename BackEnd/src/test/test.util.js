import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";

export const removeAllUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      name: "test",
      email: "test@gmail.com",
      password: await bcrypt.hash("rahasia", 10),
    },
  });
};

export const removeAllCategory = async () => {
  await prismaClient.category.deleteMany({
    where: {
      name: "category test",
    },
  });
};
export const createTestCategory = async () => {
  await prismaClient.category.create({
    data: {
      name: "category test",
    },
  });
};

export const removeAllProducts = async () => {
  await prismaClient.products.deleteMany({
    where: {
      name: "product test",
    },
  });
};
