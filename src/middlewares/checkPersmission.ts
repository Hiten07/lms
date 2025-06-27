import { Request, Response, NextFunction } from "express";
import { permissionsRepositories } from "../repositories/permissions.repositories";
import { Permission } from "../models/Permission";
import { Role } from "../models/Role";

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: No user found in request" });
      }

      const existinguser = await permissionsRepositories.checkPermissionsForUsersRoles(userId,requiredPermission);

      if (!existinguser) {
        res.status(401).json({ message: "Unauthorized: User not found" });
      }

      const hasPermission = existinguser?.Roles.some((role: Role) => {
        return role.Permissions.some((permission: Permission) => {
          return permission.permissionname === requiredPermission; 
        });
      });
      

      console.log(hasPermission)
      if (!hasPermission) {
        res
          .status(403)
          .json({
            message: "Forbidden: You do not have the required permission",
          });
      }

      next();
    } catch (error) { 
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}; 
