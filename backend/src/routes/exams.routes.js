"use strict";

const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { create, getById, listByUser } = require("../controllers/examController");

const router = express.Router();

router.post("/", asyncHandler(create));
router.get("/user/:userId", asyncHandler(listByUser));
router.get("/:id", asyncHandler(getById));

module.exports = { examRouter: router };
