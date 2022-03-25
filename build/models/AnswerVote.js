"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const answerVote = new Schema({
    answerId: { type: mongoose.Types.ObjectId, ref: 'Question' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    upvote: { type: Boolean },
});
exports.default = mongoose.model('AnswerVote', answerVote);
