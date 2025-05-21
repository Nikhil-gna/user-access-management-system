import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../dataSource/dataSource";
import { User } from "../entities/User.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AppError } from "../utils/ApiError";
import { SignupSchema, LoginSchema } from "../validators/auth.schema";
import { z } from "zod";
import { sendResponse, sendError } from "../utils/ApiResponse";

const userRepo = AppDataSource.getRepository(User);

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = SignupSchema.parse(req.body);

    const existing = await userRepo.findOneBy({ username });
    if (existing) {
      throw new AppError("Username is already taken.", 409, "USERNAME_TAKEN");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      username,
      password: hashed,
      role: "Employee",
    });
    await userRepo.save(user);

    return sendResponse(res, 201, "User created successfully", {
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return sendError(
        res,
        400,
        "Validation Error",
        "VALIDATION_ERROR",
        err.errors
      );
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);

    const user = await userRepo.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return sendResponse(res, 200, "Login successful", {
      token,
      role: user.role,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return sendError(
        res,
        400,
        "Validation Error",
        "VALIDATION_ERROR",
        err.errors
      );
    }
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("User not authenticated.", 401, "NOT_AUTHENTICATED");
    }

    return sendResponse(res, 200, "User found successfully", {
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};
