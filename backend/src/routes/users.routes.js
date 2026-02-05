"use strict";

const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { register, getById, list, getByPhone } = require("../controllers/userController");

const router = express.Router();

router.post("/", asyncHandler(register));
router.get("/", asyncHandler(list));
router.get("/by-phone/:phone", asyncHandler(getByPhone));
router.get("/:id", asyncHandler(getById));

module.exports = { userRouter: router };
