import { Request, Response, NextFunction } from "express";

export const validateparams = (
  params: { name: string; type: string | number }[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let hasError = false; 

    for (const { name, type } of params) {
      const value = req.params[name];

      if (value == undefined || value == null) {
        hasError = true; 
        res.status(400).json({
          message: `${name} can't be null or undefined, please provide a valid value`,
        });
      } 
      
      else if (type === "number") {
        const isNumeric = /^\d+$/.test(value);
        if (!isNumeric) {
          hasError = true;
          res.status(400).json({
            message: `${name} must be a valid number`,
          });
        } else {
          req.params[name] = Number(value) as any; 
        }
      }
    }

    if (!hasError) {
      next(); 
    }
  };
};
