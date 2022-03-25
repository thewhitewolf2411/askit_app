"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/signup', [
    (0, express_validator_1.check)("email").isEmail(),
    (0, express_validator_1.check)("password").isLength({ min: 6 })
], AuthController_1.signUp);
authRoutes.post('/login', AuthController_1.login);
exports.default = authRoutes;
