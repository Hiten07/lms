"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const helperError_1 = require("../errors/helperError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (role) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(500).json({
                    message: "no token found",
                });
            }
            const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            for (const role of data.roles) {
                if (!role.includes(role)) {
                    res.status(403).json({
                        message: "access denied for user"
                    });
                }
                else {
                    req.user = data;
                    next();
                }
            }
        }
        catch (error) {
            // res.clearCookie('access_token');
            (0, helperError_1.catchResponse)(res, error);
        }
    };
};
exports.verifyToken = verifyToken;
