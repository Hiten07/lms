import jwt, { JwtHeader } from "jsonwebtoken";
import dotenv from "dotenv";
import { userSignupDetails } from "../types/interfaces";
dotenv.config();

export const generateToken = async (data: userSignupDetails) => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY as jwt.Secret, {
      expiresIn: "24hr",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const decodeToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};
