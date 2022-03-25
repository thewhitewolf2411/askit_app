const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userScheema = new Schema({
    firstName:{type: String},
    lastName:{type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    questions: [{type: mongoose.Types.ObjectId, ref: 'Question' }],
    answers: [{type: mongoose.Types.ObjectId, ref: 'Answer' }],
});


export default mongoose.model('User', userScheema);