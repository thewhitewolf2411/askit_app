"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.code = errorCode;
    }
}
exports.default = HttpError;
