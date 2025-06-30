"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_services_1 = require("../services/auth.services");
const customError_1 = require("../errors/customError");
const helperError_1 = require("../errors/helperError");
exports.authController = {
    // async migration(req: Request,res: Response) {
    //   try {
    //     const result = await authService.migration();
    //     if(result) {
    //       response(res,result,"successfully transferred roles");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     catchResponse(res,error as Error);
    //   }
    // },
    async addrolepermission(req, res) {
        try {
            const permissioname = req.body.permissionname;
            const description = req.body.description;
            const rolesname = req.body.roles;
            const result = await auth_services_1.authService.addrolespermission(permissioname, description, rolesname);
            if (result) {
                (0, helperError_1.response)(res, result, "successfully transferred roles");
            }
        }
        catch (error) {
            console.log(error);
            (0, helperError_1.catchResponse)(res, error);
        }
    },
    async signup(req, res) {
        try {
            const token = await auth_services_1.authService.signup(req.body);
            if (token) {
                res.status(200).json({
                    message: "OTP sent to your email",
                    token: token,
                });
            }
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "USER_EXISTS") {
                    res.status(400).json({
                        message: error.error,
                    });
                }
                else {
                    res.status(400).json({
                        message: error.error,
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async verify(req, res) {
        try {
            const token = await auth_services_1.authService.verify(req.body);
            if (token) {
                res.status(201).json({
                    message: "Registration successfully done",
                });
            }
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "OTP_EXPIRED") {
                    res.status(400).json({
                        message: error.error,
                    });
                }
                else if (error.name === "INVALID_OTP") {
                    res.status(400).json({
                        message: error.error,
                    });
                }
                else {
                    res.status(400).json({
                        message: error.error,
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async login(req, res) {
        try {
            const isLogin = await auth_services_1.authService.login(req.body);
            res.cookie("token", isLogin);
            res.status(200).json({
                message: "Login successfully done",
                token: isLogin,
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof customError_1.customError) {
                if (error.name === "INVALID_CREDENTIALS") {
                    res.status(401).json({
                        message: error.error,
                    });
                }
                else if (error.name === "USER_NOT_FOUND") {
                    res.status(404).json({
                        message: error.error,
                    });
                }
                else {
                    res.status(400).json({
                        message: error.error,
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Something went wrong. Please try again later.",
                });
            }
        }
    },
    async instructorDetails(req, res) {
        try {
            const result = await auth_services_1.authService.addInstructorDetails(req.body, req?.user?.id, req?.user?.email);
            if (result) {
                res.status(200).json({
                    message: "Instructor details added successfully",
                });
            }
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name == "NOT_ALLOWED") {
                    res.status(400).json({
                        message: error.error,
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
};
