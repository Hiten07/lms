import bcrypt from "bcrypt";
import { userRepository } from "../repositories/auth.repositories";
import { generateToken, decodeToken } from "../utils/auth";
import { diff_minutes } from "../utils/helper";
import { sendMail } from "../utils/mailer";
import { JwtPayload } from "jsonwebtoken";
import { otp } from "../models/otp";
import {
  userSignupDetailsWithoutRoleAndID,
  userVerify,
  userLogin,
} from "../types/interfaces";
import { instructordetails } from "../models/instructor";
import { customError } from "../errors/customError";
import { Role } from "../models/Role";

export const authService = {
  async addrolespermission(
    permissioname: string,
    description: string,
    rolesname: Array<string>
  ) {
    return await userRepository.assignPermissionToRoles(
      permissioname,
      description,
      rolesname
    );
  },

  // async migration() {
  //   return await userRepository.transferRolesToUserRole();
  // },

  async signup(data: userSignupDetailsWithoutRoleAndID) {
    const existingEmail = await userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new customError("USER_EXISTS", "User already exists");
    }

    const token = await generateToken(data);
    const OTP = Math.floor((999999 - 100000) * Math.random() + 100000);
    const otpData = {
      email: data.email,
      otp: OTP,
    };

    const insertOtp = await userRepository.insertOtp(otpData as otp);

    if (insertOtp) {
      sendMail(
        data.email,
        "User Verification",
        `Your OTP for verification is ${OTP}`,
        "OTP will expiry in 10 minutes, please use it before to verify."
      );
    }
    return token;
  },

  async verify(data: userVerify) {
    const { otp, token } = data;
    const decoded = (await decodeToken(token)) as JwtPayload;

    const storedOtp = await userRepository.confirmOtp(decoded.email);
    const otp_created = new Date(storedOtp?.dataValues.createdAt) as Date;
    const current_timestamp = new Date(Date.now()) as Date;

    if (otp != storedOtp?.dataValues?.otp) {
      throw new customError("INVALID_OTP", "Invalid OTP");
    }

    console.log(diff_minutes(current_timestamp, otp_created));
    if (diff_minutes(current_timestamp, otp_created) > 1) {
      const result = await this.regenerateOtp(decoded.email);

      if (result.dataValues) {
        throw new customError(
          "OTP_EXPIRED",
          "OTP expired, new OTP has been sent to your registered email adderess"
        );
      } else {
        throw new customError("OTP_EXPIRED", "OTP expired, Please try again");
      }
    }

    await userRepository.deleteotp(otp);
    const user = {
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      email: decoded.email,
      phonenumber: decoded.phonenumber,
      password: decoded.password,
      role: decoded.role,
    };

    const iscreated = await userRepository.create(user);
    return iscreated;
  },

  async regenerateOtp(email: string) {
    const userExists = await userRepository.otpCheckRegenerate(email);
    if (!userExists) {
      throw new customError("USER_NOT_FOUND", "User  does not exist");
    }
    const OTP = Math.floor((999999 - 100000) * Math.random() + 100000);
    const otpData = {
      email: email,
      otp: OTP,
    };

    const insertOtp = await userRepository.insertOtp(otpData as otp);

    if (insertOtp) {
      sendMail(
        email,
        "Regenerate OTP for Verification",
        `Your OTP for verification is ${OTP}`,
        "OTP will expiry in 10 minutes, please use it before to verify."
      );
    }
    return insertOtp;
  },
  async login(data: userLogin) {
    const user = await userRepository.findEmailExists(data.email);
    if (!user) {
      throw new customError(
        "USER_NOT_FOUND",
        "User does not exist, please create an account"
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.dataValues.password
    );

    if (!isPasswordCorrect) {
      throw new customError("INVALID_CREDENTIALS", "Invalid credentials");
    }

    const roles =
      user.Roles?.map((role: Role) => {
        return role.rolename;
      }) || [];

    const payload = {
      id: user.id,
      email: user.email,
      roles: roles,
    };

    const token = await generateToken(payload);
    return token;
  },

  // async login(data: userLogin) {
  //   const emailExists = await userRepository.findEmailExists(data.email);
  //   if (!emailExists) {
  //     throw new customError(
  //       "USER_NOT_FOUND",
  //       "User  does not exist, please create an account"
  //     );
  //   }

  //   const decodedPassword = await bcrypt.compare(
  //     data.password,
  //     emailExists.dataValues.password
  //   );

  //   if (!decodedPassword) {
  //     throw new customError("INVALID_CREDENTIALS", "Invalid credentials");
  //   }

  //   const payload = {
  //     id: emailExists.dataValues.id,
  //     email: emailExists.dataValues.email,
  //     role: emailExists.dataValues.role,
  //   };
  //   const token = await generateToken(payload);
  //   return token;
  // },

  async addInstructorDetails(
    data: instructordetails,
    userId: number,
    email: string
  ) {
      // check if users exists
      const user = await userRepository.findEmailExists(email);
      if (!user) {
        throw new customError(
          "USER_NOT_FOUND",
          "User does not exist, please create an account"
        );
      }

      const roles =
        user.Roles?.map((role: Role) => {
          return role.rolename;
        }) || [];

      console.log(roles.includes("instrutor"));

      if (!roles.includes("instrutor")) {
        throw new customError(
          "NOT_ALLOWED",
          "Only instructor can fill details"
        );
      } 
      
      else {
        const instructorDetails = {
          userid: userId,
          qualification: data.qualification,
          bio: data.bio,
          experience: data.experience,
        };

        return await userRepository.createInstructorDetails(instructorDetails);
      }
    
  },
};
