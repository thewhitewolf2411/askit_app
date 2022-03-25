"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
});
exports.default = mongoose.model('User', userScheema);
