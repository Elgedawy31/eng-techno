import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import AppError from "../errors/AppError";
import { UserModel } from "../models/user.model";

interface JwtPayload {
  id: string;
  email?: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      throw new AppError("Authentication required", 401);
    }
    jwt.verify(
      accessToken,
      env.jwtSecret,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return next(new AppError("Invalid or expired token", 401));
        }

        try {
          const user = await UserModel.findById((decoded as JwtPayload).id).select(
            "_id email role name"
          );

          if (!user) {
            return next(new AppError("User not found", 404));
          }

          req.user = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
          };

          next();
        } catch (error) {
          next(new AppError("Authentication failed", 401));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

