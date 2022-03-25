"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const answerScheema = new Schema({
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    answer: { type: String, required: true },
    questionId: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
    upvotes: [{ type: mongoose.Types.ObjectId, ref: 'AnswerVote' }]
});
exports.default = mongoose.model('Answer', answerScheema);
