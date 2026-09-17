import bcrypt from "bcryptjs";

import { User } from "../models/User.js";
import { generateToken } from "../lib/jwt.js";

export const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
  } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("user already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    role,
  });

  return user;
};

export const loginUser = async (email, password) => {
  const checkUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!checkUser) {
    throw new Error("user not found");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    checkUser.password
  );

  if (!isPasswordValid) {
    throw new Error("invalid credentials");
  }

  const token = generateToken(checkUser);

  const user = {
    role: checkUser.role,
  };

  return {
    token,
    user,
  };
};