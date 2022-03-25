import { Router } from "express";
import { signUp, login } from '../controllers/AuthController';
import { check } from 'express-validator';

const authRoutes = Router();

authRoutes.post('/signup',
    [
        check("email").isEmail(),
        check("password").isLength({min: 6})
    ], 
    signUp);

authRoutes.post('/login', login);

export default authRoutes;