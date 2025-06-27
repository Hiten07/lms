import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  export interface Request {
    user?: JwtPayload;
  }
}