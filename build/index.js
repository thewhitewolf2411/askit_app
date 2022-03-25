"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const HttpError_1 = __importDefault(require("./models/HttpError"));
const QuestionRoutes_1 = __importDefault(require("./routes/QuestionRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const AnswerRoutes_1 = __importDefault(require("./routes/AnswerRoutes"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, '/client/build/')));
//Authorisation Routes
app.use('/api', AuthRoutes_1.default);
//User routes
app.use('/api', UserRoutes_1.default);
app.use('/api', QuestionRoutes_1.default);
app.use('/api', AnswerRoutes_1.default);
app.get('/', (req, res) => {
    (0, fs_1.readFile)(__dirname + '/client/build/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});
app.use((req, res, next) => {
    throw new HttpError_1.default(404, "Could not find this route.");
});
app.use((error, req, res, next) => {
    res
        .status(error.code || 500)
        .json({ message: error.message || "An unknown error occurred!" });
});
mongoose_1.default
    .connect("mongodb+srv://theWhiteWolf2411:fJKbT4qkOnKzp0Gp@cluster0.kvrmd.mongodb.net/askit?retryWrites=true&w=majority")
    .then(() => {
    app.listen(8000);
})
    .catch((err) => {
    console.log(err);
});
