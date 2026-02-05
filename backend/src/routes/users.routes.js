"use strict";

const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { register, getById, list } = require("../controllers/userController");

const router = express.Router();

router.post("/", asyncHandler(register));
router.get("/", asyncHandler(list));
router.get("/:id", asyncHandler(getById));

module.exports = { userRouter: router };
