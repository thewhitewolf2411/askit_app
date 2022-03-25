import { Router } from "express";
import { getUsers, getUserById } from '../controllers/UserController';
import { check } from 'express-validator';

const userRoutes = Router();

userRoutes.get('/users', getUsers);

userRoutes.get('/user/:uid', getUserById);

export default userRoutes;