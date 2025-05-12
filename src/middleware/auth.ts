import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user? : IUser
        }
    }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No Autorizado");
    res.status(401).json({
      error: error.message,
    });
    return;
  }

  // Forma 1 de obtener el token
  // const token = bearer.split(' ')[1]

  // Forma 2 de obtener el token
  const [, token] = bearer.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded == "object" && decoded.id) {
      const user = await User.findById(decoded.id).select('_id name email');
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(500).json({
          error: "Token no válido",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: "Token no válido",
    });
    return;
  }

 
}
