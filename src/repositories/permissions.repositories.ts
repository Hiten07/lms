
import { Permission } from "../models/Permission";
import { Role } from "../models/Role";
import { user } from "../models/user";

export const permissionsRepositories = {
  async checkPermissionsForUsersRoles(userId: number,requiredPermission: string) {
    return await user.findByPk(userId, {
        include: [
          {
            model: Role,
            as: "Roles",
            include: [
              {
                model: Permission,
                as: "Permissions",
                where: { permissionname: requiredPermission },
                required: false,
              },
            ],
          },
        ],
      });
  }
}