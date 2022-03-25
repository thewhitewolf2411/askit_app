import {NextFunction, Request, Response} from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Answer from '../models/Answer';
import HttpError from '../models/HttpError';
import Question from '../models/Question';
import QuestionVote from '../models/QuestionVote';
import User from '../models/User';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
    
    let questions;
    let numberOfQuestions = 20;
    if(req.query.numberofquestions){
        numberOfQuestions = parseInt(req.query.numberofquestions.toString());
    }

    try{
        questions = await Question.find().limit(numberOfQuestions).populate('author');
        if(!questions){
            res.status(200).json({questions: []});
        }
        res.status(200).json({questions: questions.map((question:any) => question.toObject({ getters: true }))});
    } catch (exc) {
        return next(new HttpError(500, "Something went wrong."));
    }
}

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    let question;

    const questionId = req.params.qid;

    try{
        question = await Question.findById(questionId).populate('answers').populate('author').populate('upvotes');
        if(!question){
            return next(new HttpError(404, "Question not found."));
        }
        question.answers = await Answer.find({questionId: questionId}).populate('author').populate('upvotes');

        return res.status(200).json({question: question.toObject({ getters: true })});
    } catch (exc) {
        return next(new HttpError(500, "Something went wrong."));
    }
}

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(422, "Invalid data passed, please check your inputs."));
    }

    const { question, author } = req.body;

    const createdQuestion = new Question({
        question,
        author
    });

    let user;

    try {
        user = await User.findById(author);
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdQuestion.save({ session: sess });
        user.questions.push(createdQuestion);
        await user.save({ session: sess });
        await sess.commitTransaction();

        return res.status(201).json({createdQuestion});
    } catch (err) {
        return next(new HttpError(500, "Creating question failed, please try again."));
    }
}

export const upvoteQuestion = async (req: Request, res: Response, next: NextFunction) => {

    const questionId = req.params.qid;

    const { userId, upvote } = req.body;
    let question;
    let user;

    try{
        question = await Question.findById(questionId);
        user = await User.findById(userId);
        if(!question || !user){
            return next(new HttpError(404, "Something went wrong."));
        }

        const questionVotes = await QuestionVote.find({questionId: questionId, userId: userId});

        if(questionVotes && questionVotes.length > 0){
            if(questionVotes[0].upvote !== upvote){

                const questionVote = new QuestionVote({
                    questionId: question,
                    userId: user,
                    upvote: upvote
                });

                const sess = await mongoose.startSession();
                sess.startTransaction();
                await question.upvotes.pull(questionVotes[0].id);
                await questionVotes[0].remove({session: sess});
                await questionVote.save({ session: sess });
                question.upvotes.push(questionVote.id);
                await question.save({ session: sess });
                await sess.commitTransaction();
            }
            else{
                const sess = await mongoose.startSession();
                sess.startTransaction();
                question.upvotes.pull(questionVotes[0].id);
                await question.save({session: sess});
                await questionVotes[0].remove({session: sess});
                await sess.commitTransaction();
            }
        }
        else{
            const questionVote = new QuestionVote({
                questionId: question,
                userId: user,
                upvote: upvote
            });
    
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await questionVote.save({ session: sess });
            question.upvotes.push(questionVote.id);
            await question.save({ session: sess });
            await sess.commitTransaction();
        }

        return res.status(200).json({message: 'Success'});
    } catch (exc) {
        return next(new HttpError(500, "Something went wrong."));
    }
}