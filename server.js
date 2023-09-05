require('dotenv').config();
const mysql = require('mysql');
const pool = require("./server/config/database");
// const mysqlConnection  = require("./server/config/database");
const express = require("express");

const cors = require("cors");
const app = express();
const port = process.env.PORT;

const userRouter = require("./server/api/users/user.router");
const questionRouter = require("./server/api/questions/question.router");
const answerRouter = require("./server/api/answers/answer.router");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/questions", questionRouter);
app.use("/api/answers", answerRouter);


// app.use("/api/questions", userRouter);
// app.use("/api/answers", userRouter);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
// app.listen(port, () => console.log(`Listening at http://127.0.0.1:${port}`));
