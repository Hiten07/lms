"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const permissions_repositories_1 = require("../repositories/permissions.repositories");
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res
                    .status(401)
                    .json({ message: "Unauthorized: No user found in request" });
            }
            const existinguser = await permissions_repositories_1.permissionsRepositories.checkPermissionsForUsersRoles(userId, requiredPermission);
            if (!existinguser) {
                res.status(401).json({ message: "Unauthorized: User not found" });
            }
            const hasPermission = existinguser?.Roles.some((role) => {
                return role.Permissions.some((permission) => {
                    return permission.permissionname === requiredPermission;
                });
            });
            console.log(hasPermission);
            if (!hasPermission) {
                res
                    .status(403)
                    .json({
                    message: "Forbidden: You do not have the required permission",
                });
            }
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
};
exports.checkPermission = checkPermission;
