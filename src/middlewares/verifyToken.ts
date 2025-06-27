import { Request, Response, NextFunction } from "express";
import { catchResponse } from "../errors/helperError";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const verifyToken = (role: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        res.status(500).json({
          message: "no token found",
        });
      }
      const data = jwt.verify(
        token as string,
        process.env.JWT_SECRET_KEY as string
      ) as CustomJwtPayload;
      

      for(const role of data.roles) {
        if (!role.includes(role)) {
          res.status(403).json({
            message: "access denied for user"
          })
        } else {
          req.user = data;
          next();
        }
      }
   
    } catch (error: unknown) {
      // res.clearCookie('access_token');
      catchResponse(res, error as Error);
    }
  };
};

export { verifyToken };
