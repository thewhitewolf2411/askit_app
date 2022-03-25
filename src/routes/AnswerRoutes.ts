import { RequestHandler, Router } from "express";

import * as AnswerController from '../controllers/AnswersController';
import {checkAuthMiddleware} from "../middleware/CheckAuthMiddleware";

const answerRoutes = Router();

answerRoutes.use(checkAuthMiddleware as RequestHandler);

answerRoutes.post('/answer/:qid', AnswerController.createAnswer);

answerRoutes.post('/upvoteanswer/:aid', AnswerController.upwoteAnswer);

answerRoutes.delete('/answer/:aid', AnswerController.deleteAnswer);

export default answerRoutes;