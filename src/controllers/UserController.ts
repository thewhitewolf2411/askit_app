import {NextFunction, Request, Response} from 'express';
import Answer from '../models/Answer';
import HttpError from '../models/HttpError';
import Question from '../models/Question';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    let users;

    try {
        users = await User.find({}, "-password").limit(20);

        if (!users) {
            res.status(200).json({users: []});
        }

        return res.status(200).json({users: users.map((user:any) => user.toObject({ getters: true }))});
    
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Something went wrong, please try again later."));
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.uid;

    let user;
    let questions;
    let answers;

    try{
        user = await User.findById(userId, "-password");
        
        if(!user){
            return next(new HttpError(404, "Could not find user."));
        }

        questions = await Question.find({author: user.id});
        answers = await Answer.find({author: user.id});

        return res.status(200).json({user: user.toObject({ getters: true }), 
                                    questions: questions.map((question:any) => question.toObject({ getters:true })),
                                    answers: answers.map((answer:any) => answer.toObject({ getters: true }))
                                });

    } catch (err){
        console.log(err);
        return next(new HttpError(500, "Something went wrong, please try again later."));
    }
}