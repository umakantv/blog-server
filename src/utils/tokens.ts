import jwt from "jsonwebtoken";
import config from "../config";

export function generateToken(data: any): string {
  return jwt.sign(data, config.JWT_SECRET);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, config.JWT_SECRET);
}
