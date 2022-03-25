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
exports.getUserById = exports.getUsers = void 0;
const Answer_1 = __importDefault(require("../models/Answer"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    try {
        users = yield User_1.default.find({}, "-password").limit(20);
        if (!users) {
            res.status(200).json({ users: [] });
        }
        return res.status(200).json({ users: users.map((user) => user.toObject({ getters: true })) });
    }
    catch (err) {
        console.log(err);
        return next(new HttpError_1.default(500, "Something went wrong, please try again later."));
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.uid;
    let user;
    let questions;
    let answers;
    try {
        user = yield User_1.default.findById(userId, "-password");
        if (!user) {
            return next(new HttpError_1.default(404, "Could not find user."));
        }
        questions = yield Question_1.default.find({ author: user.id });
        answers = yield Answer_1.default.find({ author: user.id });
        return res.status(200).json({ user: user.toObject({ getters: true }),
            questions: questions.map((question) => question.toObject({ getters: true })),
            answers: answers.map((answer) => answer.toObject({ getters: true }))
        });
    }
    catch (err) {
        console.log(err);
        return next(new HttpError_1.default(500, "Something went wrong, please try again later."));
    }
});
exports.getUserById = getUserById;
