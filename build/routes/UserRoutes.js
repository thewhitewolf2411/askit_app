"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/users', UserController_1.getUsers);
userRoutes.get('/user/:uid', UserController_1.getUserById);
exports.default = userRoutes;
