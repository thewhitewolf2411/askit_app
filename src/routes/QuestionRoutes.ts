import { RequestHandler, Router } from "express";
import { check } from 'express-validator';

import * as QuestionController from '../controllers/QuestionController';
import {checkAuthMiddleware} from "../middleware/CheckAuthMiddleware";

const questionRoutes = Router();

questionRoutes.get('/questions', QuestionController.getQuestions);

questionRoutes.get('/question/:qid', QuestionController.getQuestionById);

questionRoutes.use(checkAuthMiddleware as RequestHandler);

questionRoutes.post('/questions', 
    [
        check("question").not().isEmpty(),
    ],
    QuestionController.createQuestion);

questionRoutes.post('/upvotequestion/:qid', QuestionController.upvoteQuestion);

//questionRoutes.delete('/question/:qid', QuestionController.deleteQuestion);

export default questionRoutes;