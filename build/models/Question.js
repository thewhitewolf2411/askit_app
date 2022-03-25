"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionScheema = new Schema({
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    question: { type: String, required: true },
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
    upvotes: [{ type: mongoose.Types.ObjectId, ref: 'QuestionVote' }]
});
exports.default = mongoose.model('Question', questionScheema);
