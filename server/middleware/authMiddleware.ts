import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config();

// Extend the Request interface to include the user property
interface AuthRequest extends Request {
  user?: {
    //Use a more specific user type
    _id: Types.ObjectId;
    email?: string;
    role?: string;
  } | null;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      }; // Type assertion

      // Get user from the token
      req.user = await User.findById(decoded.id).select("_id email role");

      if (!req.user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};

const authorizeRoles = (roles: string[]): void => {
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized, user not found" });
    }
    if (!roles.includes(req.user!.role!)) {
      res.status(403).json({ message: "Forbidden, insufficient privileges." });
    }
    next();
  };
};

const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ((req as any).user.role !== "recruiter") {
    res.status(403).send({ error: "Unauthorized" });
  }
  next();
};

export { protect, authorizeRoles, authorizeAdmin };
