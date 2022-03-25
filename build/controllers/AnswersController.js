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
exports.deleteAnswer = exports.upwoteAnswer = exports.createAnswer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Answer_1 = __importDefault(require("../models/Answer"));
const AnswerVote_1 = __importDefault(require("../models/AnswerVote"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const createAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.qid;
    const { answer, userId } = req.body;
    const question = yield Question_1.default.findById(questionId);
    const user = yield User_1.default.findById(userId);
    if (!question || !user) {
        return next(new HttpError_1.default(404, "Something went wrong."));
    }
    const createdAnswer = new Answer_1.default({
        questionId,
        answer,
        author: user.id
    });
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdAnswer.save({ session: sess });
        user.answers.push(createdAnswer);
        question.answers.push(createdAnswer);
        yield question.save({ session: sess });
        yield user.save({ session: sess });
        yield sess.commitTransaction();
        createdAnswer.author = user;
        return res.status(201).json({ createdAnswer: createdAnswer.toObject({ getters: true }), status: 201 });
    }
    catch (err) {
        return next(new HttpError_1.default(500, "Creating question failed, please try again."));
    }
});
exports.createAnswer = createAnswer;
const upwoteAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const answerId = req.params.aid;
    const { userId, upvote } = req.body;
    let answer;
    let user;
    try {
        answer = yield Answer_1.default.findById(answerId);
        user = yield User_1.default.findById(userId);
        if (!answer || !user) {
            return next(new HttpError_1.default(404, "Something went wrong."));
        }
        const answerVotes = yield AnswerVote_1.default.find({ answerId: answerId, userId: userId });
        if (answerVotes && answerVotes.length > 0) {
            if (answerVotes[0].upvote !== upvote) {
                const answerVote = new AnswerVote_1.default({
                    answerId: answer,
                    userId: user,
                    upvote: upvote
                });
                const sess = yield mongoose_1.default.startSession();
                sess.startTransaction();
                yield answer.upvotes.pull(answerVotes[0].id);
                yield answerVotes[0].remove({ session: sess });
                yield answerVote.save({ session: sess });
                answer.upvotes.push(answerVote.id);
                yield answer.save({ session: sess });
                yield sess.commitTransaction();
            }
            else {
                const sess = yield mongoose_1.default.startSession();
                sess.startTransaction();
                answer.upvotes.pull(answerVotes[0].id);
                yield answer.save({ session: sess });
                yield answerVotes[0].remove({ session: sess });
                yield sess.commitTransaction();
            }
        }
        else {
            const answerVote = new AnswerVote_1.default({
                answerId: answer,
                userId: user,
                upvote: upvote
            });
            const sess = yield mongoose_1.default.startSession();
            sess.startTransaction();
            yield answerVote.save({ session: sess });
            answer.upvotes.push(answerVote.id);
            yield answer.save({ session: sess });
            yield sess.commitTransaction();
        }
        return res.status(200).json({ message: 'Success' });
    }
    catch (exc) {
        return next(new HttpError_1.default(500, "Something went wrong."));
    }
});
exports.upwoteAnswer = upwoteAnswer;
const deleteAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteAnswer = deleteAnswer;
