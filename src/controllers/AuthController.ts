import {NextFunction, Request, Response} from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import HttpError from '../models/HttpError';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //return res.status(422).json({message: "Invalid data passed, please check your inputs."});
        return next(new HttpError(422, "Invalid data passed, please check your inputs."));
    }

    const { firstName, lastName, email, password } = req.body;

    let existingUser;
    let hashedPassword;

    try{
        existingUser = await User.findOne({email: email});
        hashedPassword = await bcrypt.hash(password, 16);
        if(existingUser){
            //return res.status(422).json({message: "User exists already, please login instead."});
            return next(new HttpError(422, "User exists already, please login instead."));
        }

        const createdUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await createdUser.save();

        const _token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3",
            {expiresIn: '9999 years' }
        );

        return res.status(201).json({userId: createdUser.id, email: createdUser.email, token: _token});

    } catch (err){
        //return res.status(500).json({message: "Signing up failed, please try again later."});
        return next(new HttpError(422, "Signing up failed, please try again later."));
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            //return res.status(403).json({message: "Could not log you in. Invalid Credentials."});
            return next(new HttpError(403, "Could not log you in. Invalid Credentials."));
        }

        let isValidPassword = false;
        isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            //return res.status(403).json({message: "Could not log you in. Invalid Credentials."});
            return next(new HttpError(403, "Could not log you in. Invalid Credentials."));
        }

        const _token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3",
            {expiresIn: '9999 years'}
        );

        return res.status(200).json({userId: existingUser.id, email: existingUser.email, token: _token,});
    
    } catch (err) {
        //return res.status(500).json({message: "Logging in failed, please try again later."});
        return next(new HttpError(500, "Logging in failed, please try again later."));
    }
}