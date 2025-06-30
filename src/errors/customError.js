"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
class customError extends Error {
    constructor(name, error, cause) {
        super(error);
        this.name = name;
        this.error = error;
        this.cause = cause;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, customError.prototype);
    }
}
exports.customError = customError;
