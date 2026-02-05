"use strict";

const express = require("express");
const { userRouter } = require("./users.routes");
const { examRouter } = require("./exams.routes");

const router = express.Router();

router.use("/users", userRouter);
router.use("/exams", examRouter);

module.exports = { apiRouter: router };
