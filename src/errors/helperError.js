"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchResponse = exports.response = void 0;
const response = (res, data, message) => {
    return res.status(200).json({
        data: data,
        message: message,
    });
};
exports.response = response;
const catchResponse = (res, error) => {
    return res.status(401).json({ message: error });
};
exports.catchResponse = catchResponse;
