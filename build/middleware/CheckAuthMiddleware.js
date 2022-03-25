"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuthMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3");
        req.userData = { userId: decodedToken.userId };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};
exports.checkAuthMiddleware = checkAuthMiddleware;
