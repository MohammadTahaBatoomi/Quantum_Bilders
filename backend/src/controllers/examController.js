"use strict";

const {
  createExam,
  getExamById,
  listExamsByUser,
  saveDraft,
  getDraftByUser,
  clearDraftByUser,
} = require("../services/examService");

const create = async (req, res) => {
  const exam = await createExam(req.body);
  res.status(201).json({ success: true, data: exam });
};

const getById = async (req, res) => {
  const exam = await getExamById(req.params.id);
  res.status(200).json({ success: true, data: exam });
};

const listByUser = async (req, res) => {
  const exams = await listExamsByUser(req.params.userId);
  res.status(200).json({ success: true, data: exams });
};

const saveDraftHandler = async (req, res) => {
  const draft = await saveDraft(req.body);
  res.status(200).json({ success: true, data: draft });
};

const getDraftHandler = async (req, res) => {
  const draft = await getDraftByUser(req.params.userId);
  res.status(200).json({ success: true, data: draft });
};

const clearDraftHandler = async (req, res) => {
  const result = await clearDraftByUser(req.params.userId);
  res.status(200).json({ success: true, data: result });
};

module.exports = {
  create,
  getById,
  listByUser,
  saveDraftHandler,
  getDraftHandler,
  clearDraftHandler,
};
