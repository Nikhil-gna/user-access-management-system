import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../dataSource/dataSource";
import { Software } from "../entities/Software.entity";
import { sendResponse, sendError } from "../utils/ApiResponse";
import { AppError } from "../utils/ApiError";
import { z } from "zod";
import { CreateSoftwareSchema } from "../validators/software.schema";

const softwareRepo = AppDataSource.getRepository(Software);

export const createSoftware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, accessLevels } = CreateSoftwareSchema.parse(
      req.body
    );

    const existing = await softwareRepo.findOneBy({ name });
    if (existing) {
      throw new AppError("Software already exists.", 409, "SOFTWARE_EXISTS");
    }

    const software = softwareRepo.create({ name, description, accessLevels });
    await softwareRepo.save(software);

    return sendResponse(res, 201, "Software created successfully", {
      id: software.id,
      name: software.name,
      description: software.description,
      accessLevels: software.accessLevels,
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

export const getAllSoftware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const softwareList = await softwareRepo.find();

    return sendResponse(
      res,
      200,
      "Software list fetched successfully",
      softwareList
    );
  } catch (err) {
    next(err);
  }
};
