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
exports.upvoteQuestion = exports.createQuestion = exports.getQuestionById = exports.getQuestions = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const Answer_1 = __importDefault(require("../models/Answer"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const Question_1 = __importDefault(require("../models/Question"));
const QuestionVote_1 = __importDefault(require("../models/QuestionVote"));
const User_1 = __importDefault(require("../models/User"));
const getQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let questions;
    let numberOfQuestions = 20;
    if (req.query.numberofquestions) {
        numberOfQuestions = parseInt(req.query.numberofquestions.toString());
    }
    try {
        questions = yield Question_1.default.find().limit(numberOfQuestions).populate('author');
        if (!questions) {
            res.status(200).json({ questions: [] });
        }
        res.status(200).json({ questions: questions.map((question) => question.toObject({ getters: true })) });
    }
    catch (exc) {
        return next(new HttpError_1.default(500, "Something went wrong."));
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let question;
    const questionId = req.params.qid;
    try {
        question = yield Question_1.default.findById(questionId).populate('answers').populate('author').populate('upvotes');
        if (!question) {
            return next(new HttpError_1.default(404, "Question not found."));
        }
        question.answers = yield Answer_1.default.find({ questionId: questionId }).populate('author').populate('upvotes');
        return res.status(200).json({ question: question.toObject({ getters: true }) });
    }
    catch (exc) {
        return next(new HttpError_1.default(500, "Something went wrong."));
    }
});
exports.getQuestionById = getQuestionById;
const createQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new HttpError_1.default(422, "Invalid data passed, please check your inputs."));
    }
    const { question, author } = req.body;
    const createdQuestion = new Question_1.default({
        question,
        author
    });
    let user;
    try {
        user = yield User_1.default.findById(author);
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdQuestion.save({ session: sess });
        user.questions.push(createdQuestion);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
        return res.status(201).json({ createdQuestion });
    }
    catch (err) {
        return next(new HttpError_1.default(500, "Creating question failed, please try again."));
    }
});
exports.createQuestion = createQuestion;
const upvoteQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.qid;
    const { userId, upvote } = req.body;
    let question;
    let user;
    try {
        question = yield Question_1.default.findById(questionId);
        user = yield User_1.default.findById(userId);
        if (!question || !user) {
            return next(new HttpError_1.default(404, "Something went wrong."));
        }
        const questionVotes = yield QuestionVote_1.default.find({ questionId: questionId, userId: userId });
        if (questionVotes && questionVotes.length > 0) {
            if (questionVotes[0].upvote !== upvote) {
                const questionVote = new QuestionVote_1.default({
                    questionId: question,
                    userId: user,
                    upvote: upvote
                });
                const sess = yield mongoose_1.default.startSession();
                sess.startTransaction();
                yield question.upvotes.pull(questionVotes[0].id);
                yield questionVotes[0].remove({ session: sess });
                yield questionVote.save({ session: sess });
                question.upvotes.push(questionVote.id);
                yield question.save({ session: sess });
                yield sess.commitTransaction();
            }
            else {
                const sess = yield mongoose_1.default.startSession();
                sess.startTransaction();
                question.upvotes.pull(questionVotes[0].id);
                yield question.save({ session: sess });
                yield questionVotes[0].remove({ session: sess });
                yield sess.commitTransaction();
            }
        }
        else {
            const questionVote = new QuestionVote_1.default({
                questionId: question,
                userId: user,
                upvote: upvote
            });
            const sess = yield mongoose_1.default.startSession();
            sess.startTransaction();
            yield questionVote.save({ session: sess });
            question.upvotes.push(questionVote.id);
            yield question.save({ session: sess });
            yield sess.commitTransaction();
        }
        return res.status(200).json({ message: 'Success' });
    }
    catch (exc) {
        return next(new HttpError_1.default(500, "Something went wrong."));
    }
});
exports.upvoteQuestion = upvoteQuestion;
