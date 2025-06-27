import { user } from "../models/user";
import { otp } from "../models/otp";
import { instructordetails } from "../models/instructor";
import { userOtpData, instructorDetails } from "../types/customtypes";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { Rolespermissions } from "../models/Rolespermission";
import { Userrole } from "../models/Userrole";
import { userSignupDetails } from "../types/interfaces";

export const userRepository = {
  async assignPermissionToRoles(
    permissionName: string,
    description: string,
    roleNames: string[] 
  ) {
    {
      const [permission,created] = await Permission.findOrCreate({
        where: { 
          permissionname: permissionName 
        },
        defaults: {
          description: description
        }
      });

      const roles = await Role.findAll({
        where: { rolename: roleNames },
      });

      let count = 0;
      for (const role of roles) {
        const [result,created] = await Rolespermissions.findOrCreate({
          where: {
            roleid: role.dataValues.id,
            permissionid: permission.dataValues.id,
          },
        });

        if (result) {
          count++;
        }
      }

      console.log(`Assigned "${permissionName}" to roles:`, roleNames);

      if (count > 0) {
        return true;
      }
    }
  },

  // async transferRolesToUserRole() {
  //   const t = await sequelize.transaction();
  //   try {
  //         const users = await user.findAll({transaction: t});

  //         for(const user of users) {
  //           const userrole = user.role;
  //           const userId = user.id;

  //           if(user) {
  //             const role = await Role.findOne({
  //               where: {
  //                 rolename: userrole
  //               },
  //               transaction: t
  //             })

  //             if(role) {

  //               let roleida = role?.id;
  //               const dataObj = {
  //                 userid: userId,
  //                 roleid: roleida
  //               }
  //               await Userrole.create(dataObj,{transaction: t})
  //             }
  //           }
  //         }
  //         await t.commit();
  //         return true;
  //   } catch (error) {
  //     console.log(error);
  //     await t.rollback();
  //     return false;
  //   }
  // },

  async findByEmail(email: string) {
    return await user.findOne({
      where: { email },
    });
  },

  async insertOtp(ota: userOtpData) {
    return await otp.create(ota);
  },

  async confirmOtp(email: string) {
    return await otp.findOne({
      where: {
        email: email,
      },
      order: [["createdAt", "DESC"]],
    });
  },

  async deleteotp(ot: number) {
    return await otp.destroy({
      where: {
        otp: ot,
      },
    });
  },

  async create(userobj: userSignupDetails) {
    try {
      const insertUser = {
        firstname: userobj.firstname,
        lastname: userobj.lastname,
        email: userobj.email,
        phonenumber: userobj.phonenumber,
        password: userobj.password
      }
      const result = await user.create(insertUser);
      if (result) {
        const result2 = await Role.findAll({
          where: {
            rolename: userobj.role,
          },
        });
        
        console.log(result2);
        let count = 0;

        for (const role of result2) {
          let resultcnt = await Userrole.create({
            userid: result.dataValues.id,
            roleid: role.dataValues.id,
          });
          if(resultcnt) {
            count++;
          }
        }
        return count;
      }
    } catch (error) {
      console.log(error);
    }
  },

  async findEmailExists(email: string) {
    return user.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "Roles",
          through: { attributes: [] },
        },
      ],
    });
  },

  async createInstructorDetails(data: instructorDetails) {
    return await instructordetails.create(data);
  },

  async otpCheckRegenerate(email: string) {
    return await otp.findOne({
      where: {
        email: email,
      },
    });
  },
};
