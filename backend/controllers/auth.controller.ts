import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { env } from "../config/env";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import bcrypt from "bcryptjs";
import {
  getAccessTokenCookieOptions,
} from "../utils/cookies";



export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      throw new AppError("Invalid login credentials", 401);
    }

    // Check if user has a password (for OAuth users who don't have passwords)
    if (!user.password) {
      throw new AppError("Invalid login credentials", 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid login credentials", 401);
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    const accessTokenCookieOptions = getAccessTokenCookieOptions();

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    // Get user without password
    const userResponse = await UserModel.findById(user._id).select("-password");

    sendResponse(res, 200, {
      success: true,
      message: "Logged in successfully",
      data: {
        user: userResponse,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      return sendResponse(res, 200, {
        success: true,
        message: "Not authenticated",
        data: { authenticated: false },
      });
    }

    jwt.verify(
      accessToken,
      env.jwtSecret,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return sendResponse(res, 200, {
            success: true,
            message: "Not authenticated",
            data: { authenticated: false },
          });
        }

        try {
          const user = await UserModel.findById(decoded.id).select("-password");

          if (!user) {
            return sendResponse(res, 200, {
              success: true,
              message: "Not authenticated",
              data: { authenticated: false },
            });
          }

          sendResponse(res, 200, {
            success: true,
            message: "Authenticated",
            data: {
              authenticated: true,
              user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
              accessToken: req.cookies?.accessToken || accessToken,
            },
          });
        } catch (error) {
          return sendResponse(res, 200, {
            success: true,
            message: "Not authenticated",
            data: { authenticated: false },
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token in cookies (accessToken from server, token from client) or Authorization header
    const accessToken = 
      req.cookies?.accessToken || 
      req.cookies?.token ||
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
          const user = await UserModel.findById(decoded.id).select("-password");

          if (!user) {
            return next(new AppError("User not found", 404));
          }

          sendResponse(res, 200, {
            success: true,
            message: "User data retrieved successfully",
            data: {
              user: user,
              accessToken: accessToken,
            },
          });
        } catch (error) {
          return next(new AppError("Failed to retrieve user data", 500));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessTokenCookieOptions = getAccessTokenCookieOptions();

    res.clearCookie("accessToken", accessTokenCookieOptions);

    req.logout((err: any) => {
      if (err) {
            return next(new AppError("Error in ending session", 500));
      }

      if (req.session) {
        req.session.destroy((err: any) => {
          if (err) {
            return next(new AppError("Error in ending session", 500));
          }
          sendResponse(res, 200, {
            success: true,
            message: "Logged out successfully",
          });
        });
      } else {
        sendResponse(res, 200, {
          success: true,
          message: "Logged out successfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

