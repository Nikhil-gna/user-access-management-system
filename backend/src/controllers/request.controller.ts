import { Request as Req, Response, NextFunction } from "express";
import { AppDataSource } from "../dataSource/dataSource";
import { Request as AccessRequest } from "../entities/Request.entity";
import { Software } from "../entities/Software.entity";
import { User } from "../entities/User.entity";
import { AppError } from "../utils/ApiError";
import { sendResponse, sendError } from "../utils/ApiResponse";
import {
  SubmitRequestSchema,
  UpdateRequestStatusSchema,
} from "../validators/request.schema";
import { z } from "zod";

const requestRepo = AppDataSource.getRepository(AccessRequest);
const userRepo = AppDataSource.getRepository(User);
const softwareRepo = AppDataSource.getRepository(Software);

export const submitRequest = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  try {
    const { softwareId, accessType, reason } = SubmitRequestSchema.parse(
      req.body
    );

    const software = await softwareRepo.findOneBy({ id: softwareId });
    if (!software) {
      throw new AppError("Software not found.", 404, "SOFTWARE_NOT_FOUND");
    }

    const user = await userRepo.findOneBy({ id: req.user!.id });
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    const newRequest = requestRepo.create({
      user,
      software,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepo.save(newRequest);

    return sendResponse(res, 201, "Access request submitted successfully", {
      id: newRequest.id,
      accessType: newRequest.accessType,
      status: newRequest.status,
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

export const updateRequestStatus = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestId = +req.params.id;
    const { status } = UpdateRequestStatusSchema.parse(req.body);

    const existing = await requestRepo.findOne({
      where: { id: requestId },
      relations: ["user", "software"],
    });

    if (!existing) {
      throw new AppError("Access request not found.", 404, "REQUEST_NOT_FOUND");
    }

    existing.status = status;
    await requestRepo.save(existing);

    return sendResponse(res, 200, "Request status updated", {
      id: existing.id,
      status: existing.status,
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

export const getRequests = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;

    const whereClause = role === "Manager" ? {} : { user: { id: userId } };

    const requests = await requestRepo.find({
      where: whereClause,
      relations: ["user", "software"],
    });

    if (requests.length === 0) {
      throw new AppError("No requests found.", 404, "NO_REQUESTS_FOUND");
    }

    return sendResponse(res, 200, "Requests fetched successfully", requests);
  } catch (err) {
    next(err);
  }
};
