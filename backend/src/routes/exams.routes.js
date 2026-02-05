"use strict";

const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  create,
  getById,
  listByUser,
  saveDraftHandler,
  getDraftHandler,
  clearDraftHandler,
} = require("../controllers/examController");

const router = express.Router();

router.post("/", asyncHandler(create));
router.post("/draft", asyncHandler(saveDraftHandler));
router.get("/draft/:userId", asyncHandler(getDraftHandler));
router.delete("/draft/:userId", asyncHandler(clearDraftHandler));
router.get("/user/:userId", asyncHandler(listByUser));
router.get("/:id", asyncHandler(getById));

module.exports = { examRouter: router };
