"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({message: "Invalid data passed, please check your inputs."});
        return next(new HttpError_1.default(422, "Invalid data passed, please check your inputs."));
    }
    const { firstName, lastName, email, password } = req.body;
    let existingUser;
    let hashedPassword;
    try {
        existingUser = yield User_1.default.findOne({ email: email });
        hashedPassword = yield bcrypt_1.default.hash(password, 16);
        if (existingUser) {
            //return res.status(422).json({message: "User exists already, please login instead."});
            return next(new HttpError_1.default(422, "User exists already, please login instead."));
        }
        const createdUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        yield createdUser.save();
        const _token = jsonwebtoken_1.default.sign({ userId: createdUser.id, email: createdUser.email }, "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3", { expiresIn: '9999 years' });
        return res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: _token });
    }
    catch (err) {
        //return res.status(500).json({message: "Signing up failed, please try again later."});
        return next(new HttpError_1.default(422, "Signing up failed, please try again later."));
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = yield User_1.default.findOne({ email: email });
        if (!existingUser) {
            //return res.status(403).json({message: "Could not log you in. Invalid Credentials."});
            return next(new HttpError_1.default(403, "Could not log you in. Invalid Credentials."));
        }
        let isValidPassword = false;
        isValidPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isValidPassword) {
            //return res.status(403).json({message: "Could not log you in. Invalid Credentials."});
            return next(new HttpError_1.default(403, "Could not log you in. Invalid Credentials."));
        }
        const _token = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email }, "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3", { expiresIn: '9999 years' });
        return res.status(200).json({ userId: existingUser.id, email: existingUser.email, token: _token, });
    }
    catch (err) {
        //return res.status(500).json({message: "Logging in failed, please try again later."});
        return next(new HttpError_1.default(500, "Logging in failed, please try again later."));
    }
});
exports.login = login;
