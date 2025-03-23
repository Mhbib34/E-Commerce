import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import validate from "../validation/validation.js";
import bcrypt from "bcrypt";

export const register = async (request) => {
  const user = validate(registerUserValidation, request);
  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });
  if (countUser === 1) throw new ResponseError(400, "Email already exists");
  user.password = await bcrypt.hash(user.password, 10);
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      email: true,
      name: true,
    },
  });
};
