import {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';

import Answer from '../models/Answer';
import AnswerVote from '../models/AnswerVote';
import HttpError from '../models/HttpError';
import Question from '../models/Question';
import User from '../models/User';

export const createAnswer = async (req: Request, res: Response, next: NextFunction) => {

    const questionId = req.params.qid;

    const { answer, userId } = req.body;

    const question = await Question.findById(questionId);
    const user = await User.findById(userId);

    if(!question || !user){
        return next(new HttpError(404, "Something went wrong."));
    }

    const createdAnswer = new Answer({
        questionId,
        answer,
        author: user.id
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdAnswer.save({ session: sess });
        user.answers.push(createdAnswer);
        question.answers.push(createdAnswer);
        await question.save({ session: sess });
        await user.save({ session: sess });
        await sess.commitTransaction();

        createdAnswer.author = user;

        return res.status(201).json({createdAnswer: createdAnswer.toObject({getters: true}), status: 201});
    } catch (err) {
        return next(new HttpError(500, "Creating question failed, please try again."));
    }
}

export const upwoteAnswer = async (req: Request, res: Response, next: NextFunction) => {
    const answerId = req.params.aid;

    const { userId, upvote } = req.body;
    let answer;
    let user;

    try{
        answer = await Answer.findById(answerId);
        user = await User.findById(userId);
        if(!answer || !user){
            return next(new HttpError(404, "Something went wrong."));
        }

        const answerVotes = await AnswerVote.find({answerId: answerId, userId: userId});

        if(answerVotes && answerVotes.length > 0){
            if(answerVotes[0].upvote !== upvote){

                const answerVote = new AnswerVote({
                    answerId: answer,
                    userId: user,
                    upvote: upvote
                });

                const sess = await mongoose.startSession();
                sess.startTransaction();
                await answer.upvotes.pull(answerVotes[0].id);
                await answerVotes[0].remove({session: sess});
                await answerVote.save({ session: sess });
                answer.upvotes.push(answerVote.id);
                await answer.save({ session: sess });
                await sess.commitTransaction();
            }
            else{
                const sess = await mongoose.startSession();
                sess.startTransaction();
                answer.upvotes.pull(answerVotes[0].id);
                await answer.save({session: sess});
                await answerVotes[0].remove({session: sess});
                await sess.commitTransaction();
            }
        }
        else{
            const answerVote = new AnswerVote({
                answerId: answer,
                userId: user,
                upvote: upvote
            });
    
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await answerVote.save({ session: sess });
            answer.upvotes.push(answerVote.id);
            await answer.save({ session: sess });
            await sess.commitTransaction();
        }

        return res.status(200).json({message: 'Success'});
    } catch (exc) {
        return next(new HttpError(500, "Something went wrong."));
    }
}

export const deleteAnswer = async (req: Request, res: Response, next: NextFunction) => {

}