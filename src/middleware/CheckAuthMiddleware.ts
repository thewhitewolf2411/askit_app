import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import HttpError from '../models/HttpError';

export interface RequestWithUserData extends Request {
    userData: any;
}

export const checkAuthMiddleware = (req: RequestWithUserData, res: Response, next: NextFunction) => {

  if(req.method === 'OPTIONS'){
    return next();
  }
  try {
    const token = req.headers.authorization!.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return res.status(401).json({message: "Authentication failed"});
    }

    const decodedToken = jwt.verify(token, "IFTxAVOa61DELFkvNMu9wIHuwkcEAMFRTEQszT2wJsSvA38dVC57sEcJXRC3");
    req.userData = { userId: (<any>decodedToken).userId };
    next();
  } catch (err) {
    return res.status(401).json({message: "Authentication failed"});
  }
};