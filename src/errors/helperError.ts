import { Response } from "express";

const response = (res: Response, data: any, message: string) => {
  return res.status(200).json({
    data: data,
    message: message,
  });
};

const catchResponse = (res: Response, error: Error) => {
  return res.status(401).json({ message: error });
};

export { response, catchResponse };
