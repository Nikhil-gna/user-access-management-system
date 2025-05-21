import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../dataSource/dataSource";
import { User } from "../entities/User.entity";

declare module "express" {
  interface Request {
    user?: User;
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedException());
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: payload.id });

    if (!user) return next(new UnauthorizedException());
    req.user = user;
    next();
  } catch (err) {
    return next(new UnauthorizedException());
  }
};

export default authMiddleware;
