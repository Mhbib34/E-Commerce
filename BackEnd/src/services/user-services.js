import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import validate from "../validation/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      id: true,
      username: true,
      email: true,
      name: true,
    },
  });
};

export const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });
  if (!user) throw new ResponseError(404, "Email or password is incorrect");
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid)
    throw new ResponseError(400, "Email or password is incorrect");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return { user, token };
};

export const logout = () => {
  return { success: true, message: "User logged out successfully" };
};

export const get = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) throw new ResponseError(404, "User is not found");
  return user;
};

export const emailVerifyOtp = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) throw new ResponseError(404, "User is not found");
  if (user.isAccountVerified) {
    throw new ResponseError(400, "User already verified");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      verifyOtp: otp,
      verifyOtpExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return { otp, user };
};

export const verifyEmail = async (userId, otp) => {
  if (!userId || !otp) {
    throw new ResponseError(400, "Missing details!");
  }
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (user.verifyOtpExpireAt < Date.now()) {
    throw new ResponseError(400, "OTP Expired");
  }

  if (user.verifyOtp !== Number(otp)) {
    throw new ResponseError(400, "Invalid OTP");
  }
  const updateUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      isAccountVerified: true,
      verifyOtp: null,
      verifyOtpExpireAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAccountVerified: true,
    },
  });
  return { user: updateUser };
};

export const resetOtp = async (email) => {
  if (!email) throw new ResponseError(400, "Email is required");
  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) throw new ResponseError(404, "User is not found");
  const otp = Math.floor(100000 + Math.random() * 900000);
  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      resetOtp: otp,
      resetOtpExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return { user, otp };
};

export const resetPassword = async (email, otp, newPassword) => {
  if (!email || !otp || !newPassword)
    throw new ResponseError(400, "Email, OTP and new password are required");

  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new ResponseError(404, "User is not found");

  if (user.resetOtp === "" || user.resetOtp !== otp)
    throw new ResponseError(400, "Invalid OTP");

  if (user.resetOtpExpireAt < Date.now())
    throw new ResponseError(400, "OTP expired!");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpireAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return { user };
};
