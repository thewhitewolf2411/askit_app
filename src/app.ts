import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/AuthRoutes';
import HttpError from './models/HttpError';
import questionRoutes from './routes/QuestionRoutes';
import mongoose from 'mongoose';
import userRoutes from './routes/UserRoutes';
import answerRoutes from './routes/AnswerRoutes';
import { readFile } from 'fs';
import path from 'path';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
})

app.use(express.static(path.join(__dirname, '/client/build/')));

//Authorisation Routes
app.use('/api', authRoutes);

//User routes
app.use('/api', userRoutes);
app.use('/api', questionRoutes);
app.use('/api', answerRoutes);

app.get('/', (req, res) => {
  readFile(__dirname + '/client/build/index.html', 'utf8', (err, text) => {
      res.send(text);
  });
});


app.use((req, res, next) => {
    throw new HttpError(404, "Could not find this route.");
});

app.use((error:any, req:any, res:any, next:any) => {
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://theWhiteWolf2411:fJKbT4qkOnKzp0Gp@cluster0.kvrmd.mongodb.net/askit?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });