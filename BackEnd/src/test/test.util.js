import { prismaClient } from "../application/database";

export const removeAllUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};
